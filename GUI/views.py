# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
import uuid
from forms import MainMenu
from models import Person

# Create your views here.
def test(request):
    return render(request, "BusinessMan.html")

def main_menu(request):
    users = Person.objects.filter(deleted_date=None)
    if request.method == 'POST':
        form = MainMenu(request.POST)
        if form.is_valid():
            user = Person(id=str(uuid.uuid4()), name=form.cleaned_data['name'], starting_point=form.cleaned_data['starting_point'])
            user.save()
            return HttpResponseRedirect("/home/"+user.id)
    else:
        form = MainMenu()

    for user in users:
        print user.creation_date

    return render(request, "main_menu.html", {
            'form':form,
            'users':users
        })

def home(request, id):
    try:
        user = Person.objects.get(id=id)
    except ObjectDoesNotExist:
        return HttpResponseRedirect("/main_menu")

    pounds = user.money / 100
    pence = "%02d" % ((user.money % 100),)
    return render(request, "home.html", {
            'user':user,
            'pounds':pounds,
            'pence':pence
        })