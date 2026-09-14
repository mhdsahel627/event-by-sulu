import os
from pathlib import Path
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import io

from core.models import Category, Design, DesignImage, SiteConfiguration, ContactInquiry

User = get_user_model()

def create_demo_placeholder_image(title_text, subtitle_text="Demo Placeholder - Event by Sulu", width=1200, height=800, accent_color=(197, 168, 128)):
    """
    Creates a clearly stamped, elegant dark-luxury demo placeholder image.
    Avoids passing off third-party stock photos as Event by Sulu's actual work,
    while giving a beautiful, fully functional visual representation for development.
    """
    # Deep obsidian / charcoal canvas
    img = Image.new('RGB', (width, height), color=(18, 20, 24))
    draw = ImageDraw.Draw(img)

    # Outer decorative border (champagne gold)
    border_margin = 32
    draw.rectangle(
        [(border_margin, border_margin), (width - border_margin, height - border_margin)],
        outline=accent_color,
        width=2
    )

    # Inner subtle dashed or thinner frame
    inner_margin = border_margin + 12
    draw.rectangle(
        [(inner_margin, inner_margin), (width - inner_margin, height - inner_margin)],
        outline=(45, 48, 56),
        width=1
    )

    # Corner gold accents
    corner_len = 40
    # Top-left
    draw.line([(border_margin, border_margin + corner_len), (border_margin, border_margin), (border_margin + corner_len, border_margin)], fill=accent_color, width=4)
    # Top-right
    draw.line([(width - border_margin - corner_len, border_margin), (width - border_margin, border_margin), (width - border_margin, border_margin + corner_len)], fill=accent_color, width=4)
    # Bottom-left
    draw.line([(border_margin, height - border_margin - corner_len), (border_margin, height - border_margin), (border_margin + corner_len, height - border_margin)], fill=accent_color, width=4)
    # Bottom-right
    draw.line([(width - border_margin - corner_len, height - border_margin), (width - border_margin, height - border_margin), (width - border_margin, height - border_margin - corner_len)], fill=accent_color, width=4)

    # Center Brand Mark
    brand_text = "EVENT BY SULU"
    try:
        font_large = ImageFont.load_default(size=42)
        font_title = ImageFont.load_default(size=30)
        font_sub = ImageFont.load_default(size=18)
    except Exception:
        font_large = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Draw Brand
    draw.text((width // 2, height // 2 - 90), brand_text, fill=accent_color, font=font_large, anchor="mm")
    draw.line([(width // 2 - 120, height // 2 - 55), (width // 2 + 120, height // 2 - 55)], fill=accent_color, width=1)

    # Draw Title
    draw.text((width // 2, height // 2), title_text, fill=(245, 242, 235), font=font_title, anchor="mm")

    # Draw Subtitle & Demo Notice
    draw.text((width // 2, height // 2 + 55), f"[ {subtitle_text} ]", fill=(166, 163, 156), font=font_sub, anchor="mm")
    draw.text((width // 2, height // 2 + 95), "Ready to be replaced with real decoration photography in Management Panel", fill=(120, 117, 112), font=font_sub, anchor="mm")

    buffer = io.BytesIO()
    img.save(buffer, format='JPEG', quality=90)
    return ContentFile(buffer.getvalue())


class Command(BaseCommand):
    help = 'Seeds initial database configuration, categories, demo placeholders, and optional superuser from environment.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("==> Seeding Event by Sulu Database..."))

        # 1. Site Configuration (Singleton)
        site_config, created = SiteConfiguration.objects.get_or_create(
            pk=1,
            defaults={
                'business_name': 'Event by Sulu',
                'tagline': 'Bespoke Event & Wedding Decoration Atelier',
                'phone': '9048851677',
                'whatsapp_number': '9048851677',
                'email': 'sahelmhd3@gmail.com',
                'address': '',
                'instagram_url': '',
            }
        )
        if not created:
            site_config.business_name = 'Event by Sulu'
            site_config.phone = '9048851677'
            site_config.whatsapp_number = '9048851677'
            site_config.email = 'sahelmhd3@gmail.com'
            site_config.save()
        self.stdout.write(self.style.SUCCESS(f"[OK] Site Configuration verified: {site_config.business_name} ({site_config.phone} / {site_config.email})"))

        # 2. Secure Superuser check from Environment Variables (Zero hardcoded credentials)
        admin_username = os.getenv('DJANGO_SUPERUSER_USERNAME')
        admin_password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
        admin_email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'sahelmhd3@gmail.com')

        if admin_username and admin_password:
            if not User.objects.filter(username=admin_username).exists():
                User.objects.create_superuser(
                    username=admin_username,
                    email=admin_email,
                    password=admin_password
                )
                self.stdout.write(self.style.SUCCESS(f"[OK] Created superuser '{admin_username}' from environment variables."))
            else:
                self.stdout.write(self.style.NOTICE(f"[*] Superuser '{admin_username}' already exists."))
        else:
            self.stdout.write(self.style.WARNING(
                "Notice: No DJANGO_SUPERUSER_USERNAME / DJANGO_SUPERUSER_PASSWORD detected in .env.\n"
                "To create a management owner account securely, run:\n"
                "    python manage.py createsuperuser"
            ))

        # 3. Categories with clear demo placeholder covers
        categories_data = [
            {
                'name': 'Wedding Decoration',
                'description': 'Opulent mandaps, royal aisle pathways, and bespoke floral architecture for unforgettable vows.',
                'order': 1,
            },
            {
                'name': 'Stage Decoration',
                'description': 'Statement centerpieces, sculptural backdrops, and atmospheric ambient lighting setups.',
                'order': 2,
            },
            {
                'name': 'Engagement & Reception',
                'description': 'Intimate romance woven through modern minimalism, crystal accents, and lush floral palettes.',
                'order': 3,
            },
            {
                'name': 'Birthday Celebrations',
                'description': 'Sophisticated themed atmospheres tailored for grand milestones and joyful intimate gatherings.',
                'order': 4,
            },
            {
                'name': 'Haldi & Traditional Celebrations',
                'description': 'Radiant marigold installations, traditional brass accents, and vibrant ceremonial decor.',
                'order': 5,
            },
        ]

        created_categories = {}
        for cat_data in categories_data:
            cat, cat_created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={
                    'description': cat_data['description'],
                    'display_order': cat_data['order'],
                    'is_active': True,
                }
            )
            if not cat.cover_image:
                image_file = create_demo_placeholder_image(cat_data['name'], "Category Demo Cover")
                cat.cover_image.save(f"category_{cat.slug}.jpg", image_file, save=True)
            created_categories[cat.name] = cat
            self.stdout.write(self.style.SUCCESS(f"[OK] Category: {cat.name}"))

        # 4. Sample Designs with multiple gallery photos
        designs_data = [
            {
                'category': 'Wedding Decoration',
                'title': 'Royal Ivory & Champagne Mandap',
                'short_description': 'A breathtaking royal dome framed by suspended ivory blooms, gold pillars, and warm fairy lights.',
                'detailed_description': 'Crafted for grand celebrations, this design blends traditional royal grandeur with modern editorial aesthetics. Features hand-strung jasmine cascades, warm champagne ambient lighting, velvet seating, and a grand reflective walkway.',
                'order': 1,
                'featured': True,
                'gallery_captions': ['Grand Mandap Frontal View', 'Floral Pillar Close-up', 'Aisle Walkway & Ambient Lighting']
            },
            {
                'category': 'Wedding Decoration',
                'title': 'Botanical Glasshouse Pavillion',
                'short_description': 'Lush greenery arches and glass structures bathed in warm celestial ambient illumination.',
                'detailed_description': 'An ethereal garden wonderland bringing nature indoors. Includes hanging eucalyptus installations, geometric bronze lanterns, and clean warm candlelight.',
                'order': 2,
                'featured': True,
                'gallery_captions': ['Pavillion Entrance Arch', 'Suspended Greenery Detail']
            },
            {
                'category': 'Stage Decoration',
                'title': 'Celestial Golden Horizon Stage',
                'short_description': 'Architectural ribbed gold panels, organic white orchid waterfalls, and warm uplighting.',
                'detailed_description': 'A showstopping contemporary stage featuring curved architectural arches, warm backlit panels, and asymmetrical floral arrangements designed to look stunning in photography.',
                'order': 1,
                'featured': True,
                'gallery_captions': ['Stage Overview', 'Backlit Arch Textures', 'Floral Cascade Detail']
            },
            {
                'category': 'Stage Decoration',
                'title': 'Velvet Noir & Antique Brass Stage',
                'short_description': 'Moody editorial luxury featuring deep charcoal textures, antique brass frames, and burgundy blooms.',
                'detailed_description': 'For couples seeking high-fashion dramatic aesthetics. High-contrast textures, rich velvet drapery, and warm golden accents.',
                'order': 2,
                'featured': False,
                'gallery_captions': ['Center Backdrop', 'Antique Brass Frame Close-up']
            },
            {
                'category': 'Engagement & Reception',
                'title': 'Ethereal White Rose Gazebo',
                'short_description': 'Sculpted romantic dome laden with thousands of fragrant white roses and delicate crystal chandeliers.',
                'detailed_description': 'An intimate romantic centerpiece creating dreamlike portraits. Features hand-finished crystal teardrops and soft blush undertones.',
                'order': 1,
                'featured': True,
                'gallery_captions': ['Gazebo Frontage', 'Crystal Chandelier Detail']
            },
            {
                'category': 'Birthday Celebrations',
                'title': 'Golden Jubilee Milestone Gala',
                'short_description': 'Sophisticated black and gold geometric arches with bespoke neon and warm spotlighting.',
                'detailed_description': 'An elegant celebration space with refined typography backdrops, custom photo-ops, and curated dessert table installations.',
                'order': 1,
                'featured': False,
                'gallery_captions': ['Milestone Backdrop', 'Photo Booth Arch']
            },
            {
                'category': 'Haldi & Traditional Celebrations',
                'title': 'Sunlit Marigold & Brass Sanctuary',
                'short_description': 'Vibrant yellow and saffron marigold curtains draped around antique brass urns and traditional swing.',
                'detailed_description': 'Joyous festive elegance embracing cultural richness. Features hand-woven floral tassels, brass urlis with floating petals, and ceremonial cushions.',
                'order': 1,
                'featured': True,
                'gallery_captions': ['Ceremonial Swing Setup', 'Brass Urli & Petals']
            },
        ]

        for d_data in designs_data:
            cat = created_categories[d_data['category']]
            design, d_created = Design.objects.get_or_create(
                title=d_data['title'],
                category=cat,
                defaults={
                    'short_description': d_data['short_description'],
                    'detailed_description': d_data['detailed_description'],
                    'display_order': d_data['order'],
                    'is_featured': d_data['featured'],
                    'is_active': True,
                }
            )
            if not design.primary_image:
                primary_file = create_demo_placeholder_image(d_data['title'], f"{cat.name} • Primary Cover")
                design.primary_image.save(f"design_{design.slug}_primary.jpg", primary_file, save=True)

            # Add multiple additional images if not already present
            if not design.additional_images.exists():
                for idx, caption in enumerate(d_data['gallery_captions'], 1):
                    gallery_file = create_demo_placeholder_image(d_data['title'], f"{caption} (Photo {idx})")
                    d_img = DesignImage(
                        design=design,
                        caption=caption,
                        display_order=idx
                    )
                    d_img.image.save(f"design_{design.slug}_gallery_{idx}.jpg", gallery_file, save=True)

            self.stdout.write(self.style.SUCCESS(f"[OK] Design: {design.title} (+{design.additional_images.count()} gallery images)"))

        self.stdout.write(self.style.SUCCESS("==> Database seeding completed successfully!"))
