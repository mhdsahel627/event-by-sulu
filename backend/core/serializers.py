from rest_framework import serializers
from .models import Category, Design, DesignImage, ContactInquiry, SiteConfiguration

class SiteConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfiguration
        fields = [
            'business_name',
            'tagline',
            'phone',
            'whatsapp_number',
            'email',
            'address',
            'instagram_url',
        ]


class CategorySerializer(serializers.ModelSerializer):
    designs_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'cover_image',
            'display_order',
            'is_active',
            'designs_count',
        ]
        read_only_fields = ['slug', 'designs_count']

    def get_designs_count(self, obj):
        return obj.designs.filter(is_active=True).count()


class DesignImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DesignImage
        fields = ['id', 'design', 'image', 'caption', 'display_order']


class DesignListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    images_count = serializers.SerializerMethodField()

    class Meta:
        model = Design
        fields = [
            'id',
            'category',
            'category_name',
            'category_slug',
            'title',
            'slug',
            'short_description',
            'primary_image',
            'display_order',
            'is_featured',
            'is_active',
            'created_at',
            'images_count',
        ]
        read_only_fields = ['slug', 'created_at', 'images_count']

    def get_images_count(self, obj):
        # 1 primary + additional images
        return 1 + obj.additional_images.count()


class DesignDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    additional_images = DesignImageSerializer(many=True, read_only=True)

    class Meta:
        model = Design
        fields = [
            'id',
            'category',
            'category_name',
            'category_slug',
            'title',
            'slug',
            'short_description',
            'detailed_description',
            'primary_image',
            'display_order',
            'is_featured',
            'is_active',
            'created_at',
            'additional_images',
        ]
        read_only_fields = ['slug', 'created_at', 'additional_images']


class ContactInquirySerializer(serializers.ModelSerializer):
    selected_design_title = serializers.CharField(source='selected_design.title', read_only=True, allow_null=True)

    class Meta:
        model = ContactInquiry
        fields = [
            'id',
            'name',
            'phone',
            'email',
            'message',
            'selected_design',
            'selected_design_title',
            'is_read',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'selected_design_title']
