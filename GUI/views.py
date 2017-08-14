# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
import uuid
import datetime
from forms import MainMenu
from models import Person
from models import Building
from models import BenefitsOffice
from models import Products

# Create your views here.
def test(request):
    buildings=[]
    #building = Building.objects.create(name="home", 
    #    description="This is where you return to after going out and where you can rest waiting for certain times.", 
    #    energy_used_going=0,
    #    energy_used_there=0,
    #    time_used_going=0,
    #    time_used_there=0,
    #    action_button="Rest"
    #)
    #buildings.append(building)

    #b = Building.objects.get(id=5)
    #print b.id
    #print b.name
    #building = Products.objects.create(name="Drink", 
    #    cost = 79,
    #    energy_gained = 5,
    #    hunger_gained = 0,
    #    time_using_item = 3,
    #    expiry_date = 17520,
    #    building = b
    #)
    #buildings.append(building)

    #reset_database()
    return HttpResponse(str(buildings))

def reset_database():
    for game in Person.objects.all():
        game.benefits_id = None
        game.save()
        game.delete()
    for ben in BenefitsOffice.objects.all():
        ben.delete()

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
            response = None
            if request.GET["building"] == "benefits_office":
                response = benefits_office(request, user, building)
            elif request.GET["building"] == "store":
                products = Products.objects.filter(building_id=building.id)
                return render(request, "home.html", {
                        'user':user,
                        'pounds':pounds,
                        'pence':pence,
                        'building':building,
                        'products':products,
                    })

            if response:
                return response

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

########################### buildings ################################

def benefits_office(request, user, building):
    if "action" in request.GET:
        if request.GET["action"] == "Collect":
            user.energy = user.energy - (building.energy_used_going*2+building.energy_used_there)
            if not user.benefits_id:
                ben_off = BenefitsOffice.objects.create(start_date=user.game_time, next_date=user.game_time+datetime.timedelta(days=7))
                user.benefits_id = ben_off.id
                user.money += 5790
                if user.tutorial == 0:
                    user.tutorial = 1
                    tut = Building.objects.get(name="tutorial")
                    tut.description = "Go to the store and buy a pen - You need a pen to fill out job applications. You can also purchase food from here to increase energy and hunger levels."
                    tut.save()

            user.save()
            return HttpResponseRedirect("/home/"+user.id)
