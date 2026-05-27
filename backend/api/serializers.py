
from rest_framework import serializers
from .models import *

class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = ['label', 'value', 'unit', 'trend', 'tone', 'icon']

class VariationRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariationRow
        fields = '__all__'
    
    def to_representation(self, instance):
        return [instance.year, instance.value, instance.trend, instance.sector, instance.source, instance.tone]

class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ['label', 'value', 'color']

class GhgCompositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GhgComposition
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.label, instance.value, instance.color]

class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = ['name', 'short', 'years', 'type', 'reliability', 'icon', 'summary', 'featured']

class ExplorerRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExplorerRow
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.id_code, instance.year, instance.country, instance.sector, instance.scope, instance.value, instance.gas, instance.source, instance.status]

class ComparisonRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComparisonRow
        fields = ['entity', 'scope1', 'scope2', 'scope3', 'total', 'national', 'flag', 'trend', 'trendTone']

class PeerRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PeerRow
        fields = '__all__'
    
    def to_representation(self, instance):
        return [instance.country, instance.trend, instance.value, instance.tone]

class ComplianceRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceRow
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.label, instance.value, instance.tone, instance.description]

class PerCapitaBarSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerCapitaBar
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.country, instance.value_str, instance.percentage, instance.tone]

class NetworkIntegritySerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkIntegrity
        fields = '__all__'
    
    def to_representation(self, instance):
        return [instance.label, instance.value, instance.tone]


class PipelineRowSerializer(serializers.ModelSerializer):
    class Meta:
        model = PipelineRow
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.name, instance.time, instance.status, instance.count]

class SurveyQueueSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyQueue
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.topic, instance.title, instance.summary]

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = '__all__'
    
    def to_representation(self, instance):
        return [instance.name, instance.role]

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'

    def to_representation(self, instance):
        return [instance.level, instance.message]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['full_name', 'email', 'message']
