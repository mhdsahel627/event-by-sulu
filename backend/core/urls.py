from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SiteSettingsView,
    CategoryViewSet,
    DesignViewSet,
    DesignImageViewSet,
    GalleryView,
    ContactInquiryViewSet,
    DashboardStatsView,
    AuthLoginView,
    AuthLogoutView,
    AuthMeView,
)

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('designs', DesignViewSet, basename='design')
router.register('design-images', DesignImageViewSet, basename='design-image')
router.register('inquiries', ContactInquiryViewSet, basename='inquiry')

urlpatterns = [
    # Router endpoints
    path('', include(router.urls)),

    # Site Configuration
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),

    # Public aggregated gallery
    path('gallery/', GalleryView.as_view(), name='gallery-feed'),

    # Dashboard Stats for Management
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),

    # Authentication
    path('auth/login/', AuthLoginView.as_view(), name='auth-login'),
    path('auth/logout/', AuthLogoutView.as_view(), name='auth-logout'),
    path('auth/me/', AuthMeView.as_view(), name='auth-me'),
]
