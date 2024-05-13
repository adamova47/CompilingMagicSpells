from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (AdminCncHomeNavbar, AdminCncHomeText, AdminBibtexChars,
                    AdminCogSciHomeNavbar, AdminCogSciHomeText, AdminAiSeminar,
                    AdminCncProjects, AdminUserList)
from .views import CncNavbar, CncFooter, CncGetHtmlContentByName, CncExportBib, Login, Logout

router = DefaultRouter()

router.register(r'cnc/navbar', CncNavbar, basename='cnc-navbar')
router.register(r'cnc/footer', CncFooter, basename='cnc-footer')

router.register(r'admin/cnchome', AdminCncHomeNavbar, basename='admin-cnc-navbar')
router.register(r'admin/cogscihome', AdminCogSciHomeNavbar, basename='admin-cogsci-navbar')
router.register(r'admin/bibtexchars', AdminBibtexChars, basename='admin-bibtex-chars')
router.register(r'admin/aiseminar', AdminAiSeminar, basename='admin-aiseminar')
router.register(r'admin/projects', AdminCncProjects, basename='admin-projects')
router.register(r'admin/users', AdminUserList, basename='admin-users')

urlpatterns = [
    path('', include(router.urls)),

    path('cnc/<str:name>/', CncGetHtmlContentByName.as_view(), name='cnc-get-text-by-name'),
    path('cnc/exportBib/<int:pub_id>/', CncExportBib.as_view(), name='cnc-export_bib'),

    path('admin/wslogin/', Login.as_view(), name='admin-login'),
    path('admin/wslogout/', Logout.as_view(), name='admin-logout'),

    path('admin/cnchometext/<str:getname>/', AdminCncHomeText.as_view(), name='admin-cnc-home-text'),
    path('admin/cogscitext/<str:getname>/', AdminCogSciHomeText.as_view(), name='admin-cog-sci-text'),
]
