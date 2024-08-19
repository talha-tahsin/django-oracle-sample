
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app_bap.urls')),
    path('', include('app_auth.urls')),
    path('', include('app_admin.urls')),
    path('', include('app_map.urls')),
]
