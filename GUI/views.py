# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
import uuid
from forms import MainMenu
from models import Person
from models import Building

# Create your views here.
def test(request):
    buildings=[]
    building = Building.objects.create(name="home", 
        description="This is where you return to after going out and where you can rest waiting for certain times.", 
        energy_used_going=0,
        energy_used_there=0,
        time_used_going=0,
        time_used_there=0,
        action_button="Rest"
    )
    buildings.append(building)
    return HttpResponse(str(buildings))

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

    #for user in users:
    #    print user.creation_date

    return render(request, "main_menu.html", {
            'form':form,
            'users':users
        })

def home(request, id):
    try:
        user = Person.objects.get(id=id)
    except ObjectDoesNotExist:
        return HttpResponseRedirect("/")

    pounds = user.money / 100
    pence = "%02d" % ((user.money % 100),)

    if 'building' in request.GET:
        try:
            building = Building.objects.get(name=request.GET["building"])
            return render(request, "home.html", {
                    'user':user,
                    'pounds':pounds,
                    'pence':pence,
                    'building':building,
                })
        except ObjectDoesNotExist:
            pass

    return render(request, "home.html", {
            'user':user,
            'pounds':pounds,
            'pence':pence
        })