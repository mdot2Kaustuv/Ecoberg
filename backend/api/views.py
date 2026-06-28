from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import FootprintResultSerializer
from .calculator import CarbonCalculator
from .models import FootprintCalculation


class Calculate_Footprint(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = FootprintResultSerializer(data=request.data)

        if serializer.is_valid():
            answers = serializer.validated_data['inputs']
            calculator = CarbonCalculator()
            results = calculator.calculate(answers)

            record = serializer.save(
                user=request.user if request.user.is_authenticated else None,
                total_footprint=results['total_footprint'],
                sustanibility_score=results['sustainability_score'],
                food_footprint=results['breakdown']['food'],
                transportation_footprint=results['breakdown']['transportation'],
                energy_footprint=results['breakdown']['energy'],
                shopping_footprint=results['breakdown']['shopping'],
            )

            response_payload = FootprintResultSerializer(record).data
            response_payload['recommendations'] = results['recommendations']
            response_payload['sustainability_score'] = results['sustainability_score']
            response_payload['breakdown'] = results['breakdown']

            return Response(response_payload, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FootprintHistory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        records = FootprintCalculation.objects.filter(
            user=request.user
        ).order_by('-created_at')

        data = [
            {
                'id': r.id,
                'date': r.created_at.strftime('%b %d, %Y'),
                'total_footprint': r.total_footprint,
                'sustainability_score': r.sustanibility_score,
                'breakdown': {
                    'food': r.food_footprint,
                    'transportation': r.transportation_footprint,
                    'energy': r.energy_footprint,
                    'shopping': r.shopping_footprint,
                }
            }
            for r in records
        ]

        return Response(data, status=200)