from rest_framework import serializers
from .models import FootprintCalculation

class FootprintResultSerializer(serializers.ModelSerializer):
    inputs = serializers.JSONField(write_only=True)

    class Meta:
        model = FootprintCalculation
        fields = [
            'id', 'inputs', 'quiz_input', 'total_footprint',
            'sustanibility_score', 'food_footprint',
            'transportation_footprint', 'energy_footprint',
            'shopping_footprint', 'created_at'
        ]
        read_only_fields = [
            'id', 'quiz_input', 'total_footprint', 'sustanibility_score',
            'food_footprint', 'transportation_footprint',
            'energy_footprint', 'shopping_footprint', 'created_at'
        ]

    def create(self, validated_data):
        inputs = validated_data.pop('inputs')
        return FootprintCalculation.objects.create(
            quiz_input=inputs,
            **validated_data
        )
