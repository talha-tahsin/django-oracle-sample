
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.generic import View
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout

# from .models import StudentInfo


# Create your views here.


def showLoginPage(request):
    return render(request, 'auth/login.html')


def showRegisterPage(request):
    return render(request, 'auth/register.html')


def showLogoutPage(request):
    return render(request, 'auth/logout.html')
