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
	deleted_date = models.CharField(max_length=30, default=None)