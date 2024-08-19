from django.urls import path
from . import views

urlpatterns = [

    # app_admin views ::
    path('', views.showHomePage, name="home"),


]
