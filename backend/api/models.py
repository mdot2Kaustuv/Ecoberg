
from django.db import models

class Metric(models.Model):
    CATEGORY_CHOICES = [
        ('dashboard', 'Dashboard'),
        ('per_capita', 'Per Capita'),
        ('admin', 'Admin'),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='dashboard')
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=255)
    unit = models.CharField(max_length=255, blank=True, null=True)
    trend = models.CharField(max_length=255, blank=True, null=True)
    tone = models.CharField(max_length=50, blank=True, null=True)
    icon = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"{self.category} - {self.label}"

class VariationRow(models.Model):
    year = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    trend = models.CharField(max_length=50)
    sector = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    tone = models.CharField(max_length=50)

class Sector(models.Model):
    label = models.CharField(max_length=100)
    value = models.FloatField()
    color = models.CharField(max_length=50)

class GhgComposition(models.Model):
    label = models.CharField(max_length=100)
    value = models.FloatField()
    color = models.CharField(max_length=50)

class DataSource(models.Model):
    name = models.CharField(max_length=100)
    short = models.CharField(max_length=50)
    years = models.CharField(max_length=50)
    type = models.CharField(max_length=100)
    reliability = models.CharField(max_length=50)
    icon = models.CharField(max_length=50)
    summary = models.TextField()
    featured = models.BooleanField(default=False)

class ExplorerRow(models.Model):
    id_code = models.CharField(max_length=50)
    year = models.CharField(max_length=50)
    country = models.CharField(max_length=100)
    sector = models.CharField(max_length=100)
    scope = models.CharField(max_length=50)
    value = models.CharField(max_length=50)
    gas = models.CharField(max_length=50)
    source = models.CharField(max_length=100)
    status = models.CharField(max_length=50)

class ComparisonRow(models.Model):
    entity = models.CharField(max_length=100)
    scope1 = models.CharField(max_length=50)
    scope2 = models.CharField(max_length=50)
    scope3 = models.CharField(max_length=50)
    total = models.CharField(max_length=50)
    national = models.IntegerField()
    flag = models.CharField(max_length=50)
    trend = models.CharField(max_length=50)
    trendTone = models.CharField(max_length=50)

class PeerRow(models.Model):
    country = models.CharField(max_length=100)
    trend = models.CharField(max_length=50)
    value = models.IntegerField()
    tone = models.CharField(max_length=50)

class ComplianceRow(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()
    tone = models.CharField(max_length=50)
    description = models.TextField()

class PerCapitaBar(models.Model):
    country = models.CharField(max_length=100)
    value_str = models.CharField(max_length=50)
    percentage = models.IntegerField()
    tone = models.CharField(max_length=50)

class NetworkIntegrity(models.Model):
    label = models.CharField(max_length=100)
    value = models.IntegerField()
    tone = models.CharField(max_length=50)

class PipelineRow(models.Model):
    name = models.CharField(max_length=100)
    time = models.CharField(max_length=50)
    status = models.CharField(max_length=50)
    count = models.CharField(max_length=50)

class SurveyQueue(models.Model):
    topic = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    summary = models.TextField()

class AdminUser(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)

class AuditLog(models.Model):
    level = models.CharField(max_length=50)
    message = models.TextField()

class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
