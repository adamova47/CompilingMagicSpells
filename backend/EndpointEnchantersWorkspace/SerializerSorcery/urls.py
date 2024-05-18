from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (AdminCncHomeNavbar, AdminCncHomeText, AdminBibtexChars,
                    AdminCogSciHomeNavbar, AdminCogSciHomeText, AdminAiSeminar,
                    AdminCncProjects, AdminUserList, AdminMyHomeData, AdminMyHomeNavbar, AdminGetInsertData,
                    AdminProjectsList, AdminPublications, AdminProcessBibtexs, AdminGetBibtex, AdminExportBibtexs)
from .views import CncNavbar, CncFooter, CncGetHtmlContentByName, CncGetBibtex, Login, Logout

router = DefaultRouter()

router.register(r'cnc/navbar', CncNavbar, basename='cnc-navbar')
router.register(r'cnc/footer', CncFooter, basename='cnc-footer')

router.register(r'admin/cnchome', AdminCncHomeNavbar, basename='admin-cnc-navbar')
router.register(r'admin/cnchometext', AdminCncHomeText, basename='admin-cnchome-text')
router.register(r'admin/cogscihome', AdminCogSciHomeNavbar, basename='admin-cogsci-navbar')
router.register(r'admin/cogscitext', AdminCogSciHomeText, basename='admin-cogsci-text')
router.register(r'admin/bibtexchars', AdminBibtexChars, basename='admin-bibtex-chars')
router.register(r'admin/aiseminar', AdminAiSeminar, basename='admin-aiseminar')
router.register(r'admin/projects', AdminCncProjects, basename='admin-projects')
router.register(r'admin/userslist', AdminUserList, basename='admin-userslist')
router.register(r'admin/projectslist', AdminProjectsList, basename='admin-projectslist')
router.register(r'admin/publications', AdminPublications, basename='admin-publications')

urlpatterns = [
    path('', include(router.urls)),

    path('cnc/<str:name>/', CncGetHtmlContentByName.as_view(), name='cnc-get-text-by-name'),
    path('cnc/getBib/<int:pub_id>/', CncGetBibtex.as_view(), name='cnc-export_bib'),

    path('admin/wslogin/', Login.as_view(), name='admin-login'),
    path('admin/wslogout/', Logout.as_view(), name='admin-logout'),

    path('admin/myhomenavbar/', AdminMyHomeNavbar.as_view(), name='admin-myhomenavbar'),
    path('admin/myhomedata/', AdminMyHomeData.as_view(), name='admin-myhomedata'),

    path('admin/insertdata/', AdminGetInsertData.as_view(), name='admin-insertdata'),
    path('admin/insertdata/<str:username>', AdminGetInsertData.as_view(), name='admin-insertdata-user'),

    path('admin/bibtexs/', AdminProcessBibtexs.as_view(), name='admin-bibtexs'),
    path('admin/getBib/<int:pub_id>/', AdminGetBibtex.as_view(), name='admin-export-bib'),

    path('admin/exportBibtex/', AdminExportBibtexs.as_view(), name='export-bibtex'),
]
