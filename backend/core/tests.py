from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from PIL import Image
import io

from .models import Category, Design, DesignImage, ContactInquiry, SiteConfiguration

User = get_user_model()

def get_test_image():
    file = io.BytesIO()
    image = Image.new('RGB', (100, 100), color=(18, 20, 24))
    image.save(file, 'jpeg')
    file.seek(0)
    return SimpleUploadedFile('test.jpg', file.read(), content_type='image/jpeg')

class EventBySuluBackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Admin user
        self.admin_user = User.objects.create_superuser(
            username='sulu_owner',
            email='sahelmhd3@gmail.com',
            password='SecureOwnerPass123!'
        )

        # Base site configuration
        self.site_config = SiteConfiguration.objects.create(
            business_name="Event by Sulu",
            tagline="Bespoke Event & Wedding Decoration Atelier",
            phone="9048851677",
            whatsapp_number="9048851677",
            email="sahelmhd3@gmail.com",
            address="",
            instagram_url="",
        )

        # Test Category
        self.category = Category.objects.create(
            name="Stage Decoration",
            description="Luxury stages",
            display_order=1,
            is_active=True
        )

        # Test Design with primary image and additional image
        self.design = Design.objects.create(
            category=self.category,
            title="Royal Gold Stage",
            short_description="Opulent gold stage decor",
            detailed_description="Full luxury staging with floral arches.",
            primary_image=get_test_image(),
            display_order=1,
            is_featured=True,
            is_active=True
        )

        self.additional_image = DesignImage.objects.create(
            design=self.design,
            image=get_test_image(),
            caption="Arch detail",
            display_order=1
        )

    def test_site_settings_public_read_and_admin_write(self):
        # 1. Public read
        res = self.client.get('/api/site-settings/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['business_name'], "Event by Sulu")
        self.assertEqual(res.data['phone'], "9048851677")
        self.assertEqual(res.data['email'], "sahelmhd3@gmail.com")

        # 2. Unauthenticated write denied
        patch_res = self.client.patch('/api/site-settings/', {'address': 'Kochi, Kerala'})
        self.assertIn(patch_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # 3. Authenticated admin write allowed
        self.client.force_authenticate(user=self.admin_user)
        auth_patch_res = self.client.patch('/api/site-settings/', {'address': 'Kochi, Kerala'})
        self.assertEqual(auth_patch_res.status_code, status.HTTP_200_OK)
        self.assertEqual(auth_patch_res.data['address'], 'Kochi, Kerala')
        self.client.force_authenticate(user=None)

    def test_category_security_and_public_read(self):
        # Public read active categories
        res = self.client.get('/api/categories/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(res.data), 1)

        # Unauthenticated create rejected
        post_res = self.client.post('/api/categories/', {'name': 'New Category'})
        self.assertIn(post_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_design_public_read_and_whatsapp_dynamic_binding(self):
        res = self.client.get(f'/api/designs/{self.design.slug}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['title'], "Royal Gold Stage")
        self.assertEqual(len(res.data['additional_images']), 1)

        # Check filter by category
        list_res = self.client.get(f'/api/designs/?category={self.category.slug}')
        self.assertEqual(list_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_res.data), 1)

    def test_gallery_automatic_aggregation_single_source_of_truth(self):
        """
        Verify that images uploaded to a design automatically appear in the public gallery.
        """
        res = self.client.get('/api/gallery/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Should contain 2 images: 1 primary + 1 additional
        self.assertEqual(res.data['count'], 2)
        images = res.data['results']
        titles = [img['design_title'] for img in images]
        self.assertIn("Royal Gold Stage", titles)

    def test_contact_inquiry_public_create_and_admin_view(self):
        # Public can submit enquiry
        payload = {
            'name': 'Sarah Khan',
            'phone': '9876543210',
            'email': 'sarah@example.com',
            'message': 'Looking for wedding stage decor for December.',
            'selected_design': self.design.id
        }
        post_res = self.client.post('/api/inquiries/', payload)
        self.assertEqual(post_res.status_code, status.HTTP_201_CREATED)
        inquiry_id = post_res.data['id']

        # Public cannot list inquiries
        list_res = self.client.get('/api/inquiries/')
        self.assertIn(list_res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Admin can view and mark as read
        self.client.force_authenticate(user=self.admin_user)
        admin_list = self.client.get('/api/inquiries/')
        self.assertEqual(admin_list.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(admin_list.data), 1)

        mark_res = self.client.post(f'/api/inquiries/{inquiry_id}/mark_read/')
        self.assertEqual(mark_res.status_code, status.HTTP_200_OK)
        self.assertTrue(ContactInquiry.objects.get(id=inquiry_id).is_read)
        self.client.force_authenticate(user=None)

    def test_auth_login_and_logout(self):
        # Invalid credentials
        fail_res = self.client.post('/api/auth/login/', {'username': 'wrong', 'password': 'wrong'})
        self.assertEqual(fail_res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Valid credentials
        success_res = self.client.post('/api/auth/login/', {
            'username': 'sulu_owner',
            'password': 'SecureOwnerPass123!'
        })
        self.assertEqual(success_res.status_code, status.HTTP_200_OK)
        self.assertIn('token', success_res.data)
        token = success_res.data['token']

        # Auth Me with token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        me_res = self.client.get('/api/auth/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['username'], 'sulu_owner')

        # Logout
        logout_res = self.client.post('/api/auth/logout/')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)
