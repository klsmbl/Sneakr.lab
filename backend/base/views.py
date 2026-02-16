from django.shortcuts import render
from django.http import JsonResponse
from .models import FAQ
import json

def getRoutes(request):
    return JsonResponse({'message': 'Welcome to Sneakr API'})

def getFAQs(request):
    faqs = FAQ.objects.all()
    faq_list = [
        {
            'id': faq.id,
            'question': faq.question,
            'answer': faq.answer,
            'order': faq.order
        }
        for faq in faqs
    ]
    return JsonResponse({'faqs': faq_list})
