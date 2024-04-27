from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CncNavbar, CncFooter, CncGetHtmlContentByName, CncExportBib, Login, Logout, AdminCncHomeNavbar,
                    AdminCncHomeText, AdminBibtexChars, AdminCogSciHomeNavbar, AdminCogSciHomeText, AdminAiSeminar)

router = DefaultRouter()

router.register(r'cnc/navbar', CncNavbar, basename='cnc-navbar')
router.register(r'cnc/footer', CncFooter, basename='cnc-footer')

router.register(r'admin/cnchome', AdminCncHomeNavbar, basename='admin-cnc-navbar')
router.register(r'admin/cogscihome', AdminCogSciHomeNavbar, basename='admin-cogsci-navbar')

urlpatterns = [
    path('', include(router.urls)),

    path('cnc/<str:name>/', CncGetHtmlContentByName.as_view(), name='cnc-get-text-by-name'),
    path('cnc/exportBib/<int:pub_id>/', CncExportBib.as_view(), name='cnc-export_bib'),

    path('admin/login/', Login.as_view(), name='admin-login'),
    path('admin/logout/', Logout.as_view(), name='admin-logout'),

    path('admin/cnchometext/<str:getname>/', AdminCncHomeText.as_view(), name='admin-cnc-home-text'),
    path('admin/cogscitext/<str:getname>/', AdminCogSciHomeText.as_view(), name='admin-cog-sci-text'),

    path('admin/bibtexchars/', AdminBibtexChars.as_view(), name='admin-bibtex-chars-list'),
    path('admin/bibtexchars/<int:bib_id>/', AdminBibtexChars.as_view(), name='admin-bibtex-chars-detail'),

    path('admin/aiseminar/', AdminAiSeminar.as_view(), name='admin-aiseminar-list'),
    path('admin/aiseminar/<int:seminar_id>/', AdminAiSeminar.as_view(), name='admin-aiseminar-detail'),
]
