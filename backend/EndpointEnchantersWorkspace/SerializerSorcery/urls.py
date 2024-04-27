from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CncNavbar, CncFooter, CncGetHtmlContentByName, CncExportBib, Login, Logout

router = DefaultRouter()

router.register(r'cnc/navbar', CncNavbar, basename='cnc-navbar')
router.register(r'cnc/footer', CncFooter, basename='cnc-footer')

urlpatterns = [
    path('', include(router.urls)),
    path('cnc/<str:name>/', CncGetHtmlContentByName.as_view(), name='cnc-get-text-by-name'),
    path('cnc/exportBib/<int:pub_id>/', CncExportBib.as_view(), name='cnc-export_bib'),
    path('admin/login/', Login.as_view(), name='admin-login'),
    path('admin/logout/', Logout.as_view(), name='admin-logout'),
]
