from django.shortcuts import render
from django.http import JsonResponse

def getRoutes(request):
    return JsonResponse({'message': 'Welcome to Sneakr API'})
