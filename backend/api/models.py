from django.db import models    



class CarbonCalculator (models.Model):

    CATEGORY_CHOICES = [
        ('transportation', 'Transportation'),
        ('energy', 'Energy'),
        ('waste', 'Waste'),
        ('food', 'Food'),
        ('other', 'Other'),  
    ]

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    subcategory = models.CharField(max_length=50)
    label = models.CharField(max_length=100)
    factor = models.FloatField()
    unit = models.CharField(max_length=20)
    region = models.CharField(max_length= 50 , default = 'Global')


    class TimePeriod(models.Model):
        PERIOD_CHOICES = [
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('monthly', 'Monthly'),
            ('yearly', 'Yearly'),
        ]

    factor = models.ForeignKey