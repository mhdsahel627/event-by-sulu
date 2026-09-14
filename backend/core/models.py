from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=150, unique=True, blank=True)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='categories/', blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name_plural = 'Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Design(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='designs')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    short_description = models.CharField(max_length=350)
    detailed_description = models.TextField(blank=True)
    primary_image = models.ImageField(upload_to='designs/primary/')
    display_order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Design.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.category.name})"


class DesignImage(models.Model):
    """
    Additional images for a design.
    Single source of truth: these images together with the design's primary_image
    automatically populate the public Gallery.
    """
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='additional_images')
    image = models.ImageField(upload_to='designs/gallery/')
    caption = models.CharField(max_length=250, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Image for {self.design.title} (#{self.id})"


class ContactInquiry(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=25)
    email = models.EmailField(blank=True)
    message = models.TextField()
    selected_design = models.ForeignKey(Design, on_delete=models.SET_NULL, null=True, blank=True, related_name='inquiries')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        return f"Inquiry from {self.name} ({self.phone})"


class SiteConfiguration(models.Model):
    business_name = models.CharField(max_length=150, default="Event by Sulu")
    tagline = models.CharField(max_length=250, default="Bespoke Event & Wedding Decoration Atelier")
    phone = models.CharField(max_length=25, default="9048851677")
    whatsapp_number = models.CharField(max_length=25, default="9048851677")
    email = models.EmailField(default="sahelmhd3@gmail.com")
    address = models.TextField(blank=True, default="")
    instagram_url = models.URLField(blank=True, default="")

    class Meta:
        verbose_name = 'Site Configuration'
        verbose_name_plural = 'Site Configuration'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"{self.business_name} Settings"
