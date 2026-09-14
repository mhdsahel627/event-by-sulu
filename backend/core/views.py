from rest_framework import status, viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .models import Category, Design, DesignImage, ContactInquiry, SiteConfiguration
from .serializers import (
    SiteConfigurationSerializer,
    CategorySerializer,
    DesignListSerializer,
    DesignDetailSerializer,
    DesignImageSerializer,
    ContactInquirySerializer,
)

class SiteSettingsView(APIView):
    """
    Public GET for active site settings.
    Admin-only PUT/PATCH to update settings.
    """
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        config = SiteConfiguration.get_settings()
        serializer = SiteConfigurationSerializer(config)
        return Response(serializer.data)

    def patch(self, request):
        config = SiteConfiguration.get_settings()
        serializer = SiteConfigurationSerializer(config, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        return self.patch(request)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    Categories API.
    Public: List/Retrieve active categories.
    Admin: Full CRUD.
    """
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Category.objects.all().order_by('display_order', 'name')
        return Category.objects.filter(is_active=True).order_by('display_order', 'name')

    def get_object(self):
        queryset = self.get_queryset()
        lookup_val = self.kwargs.get('pk')
        if lookup_val.isdigit():
            return get_object_or_404(queryset, pk=lookup_val)
        return get_object_or_404(queryset, slug=lookup_val)


class DesignViewSet(viewsets.ModelViewSet):
    """
    Designs API.
    Public: List/Retrieve active designs, filter by category slug or featured status.
    Admin: Full CRUD.
    """
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'by_slug']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_serializer_class(self):
        if self.action == 'retrieve' or self.action == 'by_slug':
            return DesignDetailSerializer
        return DesignListSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            qs = Design.objects.all().select_related('category').prefetch_related('additional_images')
        else:
            qs = Design.objects.filter(
                is_active=True,
                category__is_active=True
            ).select_related('category').prefetch_related('additional_images')

        # Query Filters
        category_slug = self.request.query_params.get('category')
        if category_slug:
            qs = qs.filter(category__slug=category_slug)

        category_id = self.request.query_params.get('category_id')
        if category_id:
            qs = qs.filter(category_id=category_id)

        is_featured = self.request.query_params.get('featured')
        if is_featured and is_featured.lower() in ['true', '1']:
            qs = qs.filter(is_featured=True)

        return qs.order_by('display_order', '-created_at')

    def get_object(self):
        queryset = self.get_queryset()
        lookup_val = self.kwargs.get('pk')
        if lookup_val.isdigit():
            return get_object_or_404(queryset, pk=lookup_val)
        return get_object_or_404(queryset, slug=lookup_val)

    @action(detail=False, methods=['get'], url_path='by-slug/(?P<slug>[^/.]+)')
    def by_slug(self, request, slug=None):
        design = get_object_or_404(self.get_queryset(), slug=slug)
        serializer = DesignDetailSerializer(design, context={'request': request})
        return Response(serializer.data)


class DesignImageViewSet(viewsets.ModelViewSet):
    """
    Manage additional images for a design.
    Admin only: Upload multiple images, delete, reorder.
    Single source of truth: Powers the public Gallery!
    """
    serializer_class = DesignImageSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        design_id = self.kwargs.get('design_pk') or self.request.query_params.get('design')
        if design_id:
            return DesignImage.objects.filter(design_id=design_id).order_by('display_order', 'id')
        return DesignImage.objects.all().order_by('display_order', 'id')

    def create(self, request, *args, **kwargs):
        # Support single or multiple image uploads
        design_id = request.data.get('design') or self.kwargs.get('design_pk')
        if not design_id:
            return Response({'error': 'Design ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        design = get_object_or_404(Design, pk=design_id)
        images = request.FILES.getlist('images') or request.FILES.getlist('image')
        caption = request.data.get('caption', '')

        if not images:
            return Response({'error': 'No image files provided.'}, status=status.HTTP_400_BAD_REQUEST)

        created_objs = []
        current_order = design.additional_images.count()
        for idx, img in enumerate(images, start=1):
            d_img = DesignImage.objects.create(
                design=design,
                image=img,
                caption=caption,
                display_order=current_order + idx
            )
            created_objs.append(d_img)

        serializer = DesignImageSerializer(created_objs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class GalleryView(APIView):
    """
    Public Gallery Feed:
    Aggregates images across all active Designs (primary cover + additional photos).
    Single Source of Truth: No separate gallery image upload exists.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        category_slug = request.query_params.get('category')

        designs_qs = Design.objects.filter(
            is_active=True,
            category__is_active=True
        ).select_related('category').prefetch_related('additional_images')

        if category_slug and category_slug != 'all':
            designs_qs = designs_qs.filter(category__slug=category_slug)

        gallery_items = []

        for design in designs_qs.order_by('display_order', '-created_at'):
            # 1. Add primary image
            if design.primary_image:
                gallery_items.append({
                    'id': f"pri_{design.id}",
                    'image': request.build_absolute_uri(design.primary_image.url),
                    'caption': design.short_description or design.title,
                    'design_id': design.id,
                    'design_title': design.title,
                    'design_slug': design.slug,
                    'category_id': design.category.id,
                    'category_name': design.category.name,
                    'category_slug': design.category.slug,
                    'is_primary': True,
                    'display_order': design.display_order,
                })

            # 2. Add additional design photos
            for img in design.additional_images.all().order_by('display_order', 'id'):
                if img.image:
                    gallery_items.append({
                        'id': f"add_{img.id}",
                        'image': request.build_absolute_uri(img.image.url),
                        'caption': img.caption or design.title,
                        'design_id': design.id,
                        'design_title': design.title,
                        'design_slug': design.slug,
                        'category_id': design.category.id,
                        'category_name': design.category.name,
                        'category_slug': design.category.slug,
                        'is_primary': False,
                        'display_order': img.display_order,
                    })

        return Response({
            'count': len(gallery_items),
            'results': gallery_items
        })


class ContactInquiryViewSet(viewsets.ModelViewSet):
    """
    Contact Inquiries:
    Public: POST (Create enquiry)
    Admin: Full list, inspect, mark read, delete.
    """
    serializer_class = ContactInquirySerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return ContactInquiry.objects.all().select_related('selected_design').order_by('-created_at')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def mark_read(self, request, pk=None):
        inquiry = self.get_object()
        inquiry.is_read = True
        inquiry.save()
        return Response({'status': 'marked as read'})


class DashboardStatsView(APIView):
    """
    Clean, simple overview metrics for the business owner:
    - Total Categories
    - Total Designs
    - Total Gallery Images (Primary + Additional)
    - New / Unread Inquiries
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_categories = Category.objects.count()
        total_designs = Design.objects.count()
        additional_images = DesignImage.objects.count()
        total_gallery_images = total_designs + additional_images
        new_inquiries = ContactInquiry.objects.filter(is_read=False).count()
        total_inquiries = ContactInquiry.objects.count()

        return Response({
            'total_categories': total_categories,
            'total_designs': total_designs,
            'total_gallery_images': total_gallery_images,
            'new_inquiries': new_inquiries,
            'total_inquiries': total_inquiries,
        })


class AuthLoginView(APIView):
    """
    Secure owner login endpoint.
    Issues a DRF Token and establishes Django session.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        if user is not None:
            if not user.is_staff and not user.is_superuser:
                return Response({'error': 'Access restricted to authorized personnel.'}, status=status.HTTP_403_FORBIDDEN)

            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                }
            })
        return Response({'error': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)


class AuthLogoutView(APIView):
    """
    Secure owner logout endpoint.
    Deletes token and terminates session.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        logout(request)
        return Response({'message': 'Logged out successfully.'})


class AuthMeView(APIView):
    """
    Check currently logged-in user details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })
