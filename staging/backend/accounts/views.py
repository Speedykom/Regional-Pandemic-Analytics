from django.shortcuts import render, HttpResponse


def homepage(request):
    return HttpResponse('<h2 style="text-align:center">Welcome to IGAD API Page</h2>')
