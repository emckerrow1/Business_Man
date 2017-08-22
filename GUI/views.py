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
from models import Inventory

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

    if request.method == "POST":
        if "update_basket" in request.POST or "checkout" in request.POST:
            total_cost = 0
            is_valid = True
            products = []
            for item in request.POST:
                if item != "csrfmiddlewaretoken" and item != "update_basket" and item != "checkout":
                    try:
                        product = Products.objects.get(name=item)
                        product.quantity = request.POST[item]
                        products.append(product)
                        total_cost += product.cost * int(product.quantity)

                    except ObjectDoesNotExist:
                        is_valid = False
                        break
            if is_valid:
                if "update_basket" in request.POST:

                    building = Building.objects.get(name=request.POST["update_basket"])
                    total_cost = {"pounds":total_cost/100, "pence":"%02d" % ((total_cost%100),)}
                    return render(request, "home.html", {
                            'user':user,
                            'pounds':pounds,
                            'pence':pence,
                            'building':building,
                            'products':products,
                            'total_cost':total_cost,
                        })
                else:
                    if "checkout" in request.POST:
                        building = Building.objects.get(name=request.POST["checkout"])
                    user.energy = user.energy - (building.energy_used_going*2+building.energy_used_there)
                    user.game_time += datetime.timedelta(minutes=(building.time_used_going*2+building.time_used_there))
                    user.save()
                    if user.money - total_cost < 0:
                        pass
                    else:
                        user.money -= total_cost
                        user.save()
                        for product in products:
                            if int(product.quantity) > 0:
                                if user.tutorial == 1:
                                    if product.name == "Pen":
                                        user.tutorial = 2
                                        user.save()
                                try:
                                    inventory = Inventory.objects.filter(user=user).get(products=product)
                                    inventory.quantity += int(product.quantity)
                                    inventory.save()
                                except ObjectDoesNotExist:
                                    inventory = Inventory.objects.create(user=user, products=product, quantity=product.quantity)
                                    inventory.save()
        elif "rest" in request.POST:
            hours = int(request.POST["hours"])
            minutes = int(request.POST["minutes"])
            if hours >= 0 and minutes >= 0:
                user.game_time += datetime.timedelta(hours=hours, minutes=minutes)
                user.save()


    elif 'building' in request.GET:
        try:
            building = Building.objects.get(name=request.GET["building"])
            response = None
            
            products = Products.objects.filter(building_id=building.id)

            if "action" in request.GET:
                user.energy = user.energy - (building.energy_used_going*2+building.energy_used_there)
                user.game_time += datetime.timedelta(minutes=(building.time_used_going*2+building.time_used_there))
                user.save()
                if request.GET["building"] == "benefits_office":
                    response = benefits_office(request, user)

            if products:
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

def inventory(request, id):
    try:
        user = Person.objects.get(id=id)
    except ObjectDoesNotExist:
        return HttpResponseRedirect("/")

    pounds = user.money / 100
    pence = "%02d" % ((user.money % 100),)

    items = Inventory.objects.filter(user=user)

    if request.method == "POST":
        # may need to check quantity in inventory to stop crafted requests.
        item = Inventory.objects.get(name=request.POST["item_name"])
        if (user.energy + item.products.energy_gained) > 100:
            user.energy = 100
        else:
            user.energy += item.products.energy_gained
        if (user.hunger + item.products.hunger_gained) > 100:
            user.hunger = 100
        else:
            user.hunger += item.products.hunger_gained
        user.game_time += datetime.timedelta(minutes=item.products.time_using_item)
        user.save()
        item.quantity -= 1
        item.save()

    return render(request, "inventory.html", {
            'user':user,
            'pounds':pounds,
            'pence':pence,
            'items':items
        })  
########################### buildings ################################

def benefits_office(request, user):
    if request.GET["action"] == "Collect":
        if user.benefits_id:
            early = user.benefits.next_date - datetime.timedelta(minutes=60)
            late = user.benefits.next_date + datetime.timedelta(minutes=30)

            if user.game_time > early and user.game_time < late:
                ben_obj = BenefitsOffice.objects.get(id=user.benefits_id)
                ben_obj.next_date += datetime.timedelta(days=7)
                ben_obj.save()
            else:
                return HttpResponseRedirect("/home/"+user.id)
        else:
            ben_off = BenefitsOffice.objects.create(start_date=user.game_time, next_date=user.game_time+datetime.timedelta(days=7))
            user.benefits_id = ben_off.id
            if user.tutorial == 0:
                user.tutorial = 1

        user.money += 5790
        user.save()
        return HttpResponseRedirect("/home/"+user.id)
