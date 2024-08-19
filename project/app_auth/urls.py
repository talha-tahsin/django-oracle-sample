from . import views
from django.urls import path

urlpatterns = [

    # app_auth views ::
    path('login/', views.showLoginPage, name="login"),
    path('register/', views.showRegisterPage, name="register"),
    path('logout/', views.showLogoutPage, name="logout"),


]
