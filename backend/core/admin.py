from django.contrib import admin
from .models import Category, Design, DesignImage, ContactInquiry, SiteConfiguration

class DesignImageInline(admin.TabularInline):
    model = DesignImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'is_active', 'display_order', 'created_at')
    list_editable = ('is_featured', 'is_active', 'display_order')
    list_filter = ('category', 'is_featured', 'is_active')
    search_fields = ('title', 'short_description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [DesignImageInline]

@admin.register(DesignImage)
class DesignImageAdmin(admin.ModelAdmin):
    list_display = ('id', 'design', 'caption', 'display_order')
    list_filter = ('design__category', 'design')

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'selected_design', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'phone', 'email', 'message')

@admin.register(SiteConfiguration)
class SiteConfigurationAdmin(admin.ModelAdmin):
    list_display = ('business_name', 'phone', 'whatsapp_number', 'email')
