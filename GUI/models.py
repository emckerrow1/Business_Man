# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import uuid
from datetime import datetime
from django.utils import timezone
from django.db import models

# Create your models here.
class Person(models.Model):
	id = models.CharField(max_length=100,primary_key=True, default=str(uuid.uuid4()), editable=False)
	name = models.CharField(max_length=50)
	starting_point = models.CharField(max_length=50)
	status = models.CharField(max_length=50, default="Rock Bottom")
	money = models.IntegerField(default=0)
	energy = models.IntegerField(default=100)
	hunger = models.IntegerField(default=100)
	creation_date = models.CharField(max_length=30, default=timezone.now().strftime("%Y-%m-%d %H:%M:%S"))
	game_time = models.DateTimeField(default=timezone.now())
	deleted_date = models.CharField(max_length=30, default=None)
	tutorial = models.IntegerField(default=0)
	benefits = models.ForeignKey("BenefitsOffice")

class Building(models.Model):
	name = models.CharField(max_length=75, unique=True)
	description = models.CharField(max_length=100)
	energy_used_going = models.IntegerField(default=0)
	energy_used_there = models.IntegerField(default=0)
	time_used_going = models.IntegerField(default=0)
	time_used_there = models.IntegerField(default=0)
	action_button = models.CharField(max_length=25)
	#available_jobs = models.ManyToManyField("Jobs", default=None)

#class Jobs(models.Model):
#	building = models.OneToOneField(Building)
#	job_title = models.CharField(max_length=75)
#	workable_hours = models.CharField(max_length=40)
#	hourly_wage = models.IntegerField(default=0)
#	job_description = models.CharField(max_length=200)
#   application_open_date = models.DateTimeField()
#   application_close_date = models.DateTimeField()

class Products(models.Model):
	name = models.CharField(max_length=25)
	cost = models.IntegerField(default=0)
	energy_gained = models.IntegerField(default=0)
	hunger_gained = models.IntegerField(default=0)
	time_using_item = models.IntegerField(default=0)
	expiry_date = models.IntegerField(default=0)
	building =  models.ForeignKey("Building", default=None)
	quantity = models.IntegerField(default=0)

class BenefitsOffice(models.Model):
	start_date = models.DateTimeField(default=None)
	next_date = models.DateTimeField(default=None)

class Inventory(models.Model):
	user = models.ForeignKey("Person")
	products = models.ForeignKey("Products")
	quantity = models.IntegerField(default=0)