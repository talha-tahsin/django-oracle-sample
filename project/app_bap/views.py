
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect


# from .models import StudentInfo


# Create your views here.

def showHomePage(request):
    return HttpResponse("<h1>Page was found</h1>")
    # return render(request, 'admin/map_view.html')

