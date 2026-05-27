from django.core.management.base import BaseCommand
from api.models import *
import sys
import os

# Import old data module
# sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'app'))
from api import data_source as data

class Command(BaseCommand):
    help = 'Seed database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        Metric.objects.all().delete()
        for item in data.METRICS:
            Metric.objects.create(category='dashboard', **item)
        for item in data.PER_CAPITA_METRICS:
            Metric.objects.create(category='per_capita', **item)
        for item in data.ADMIN_METRICS:
            Metric.objects.create(category='admin', **item)

        VariationRow.objects.all().delete()
        for row in data.VARIATION_ROWS:
            VariationRow.objects.create(year=row[0], value=row[1], trend=row[2], sector=row[3], source=row[4], tone=row[5])

        Sector.objects.all().delete()
        for item in data.SECTORS:
            Sector.objects.create(**item)

        GhgComposition.objects.all().delete()
        for row in data.GHG_COMPOSITION:
            GhgComposition.objects.create(label=row[0], value=row[1], color=row[2])

        DataSource.objects.all().delete()
        for item in data.DATA_SOURCES:
            DataSource.objects.create(**item)

        ExplorerRow.objects.all().delete()
        for row in data.EXPLORER_ROWS:
            ExplorerRow.objects.create(id_code=row[0], year=row[1], country=row[2], sector=row[3], scope=row[4], value=row[5], gas=row[6], source=row[7], status=row[8])

        ComparisonRow.objects.all().delete()
        for item in data.COMPARISON_ROWS:
            ComparisonRow.objects.create(**item)

        PeerRow.objects.all().delete()
        for row in data.PEER_ROWS:
            PeerRow.objects.create(country=row[0], trend=row[1], value=row[2], tone=row[3])

        ComplianceRow.objects.all().delete()
        for row in data.COMPLIANCE_ROWS:
            ComplianceRow.objects.create(label=row[0], value=row[1], tone=row[2], description=row[3])

        PerCapitaBar.objects.all().delete()
        for row in data.PER_CAPITA_BARS:
            PerCapitaBar.objects.create(country=row[0], value_str=row[1], percentage=row[2], tone=row[3])

        NetworkIntegrity.objects.all().delete()
        for row in data.NETWORK_INTEGRITY:
            NetworkIntegrity.objects.create(label=row[0], value=row[1], tone=row[2])

        PipelineRow.objects.all().delete()
        for row in data.PIPELINE_ROWS:
            PipelineRow.objects.create(name=row[0], time=row[1], status=row[2], count=row[3])

        SurveyQueue.objects.all().delete()
        for row in data.SURVEY_QUEUE:
            SurveyQueue.objects.create(topic=row[0], title=row[1], summary=row[2])

        AdminUser.objects.all().delete()
        for row in data.ADMIN_USERS:
            AdminUser.objects.create(name=row[0], role=row[1])

        AuditLog.objects.all().delete()
        for row in data.AUDIT_LOG:
            AuditLog.objects.create(level=row[0], message=row[1])

        self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
