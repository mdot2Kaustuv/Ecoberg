from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import FootprintResultSerializer
from .calculator import CarbonCalculator
from .models import FootprintCalculation 

class CalculateFootprint(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = FootprintResultSerializer(data=request.data)
        
        if serializer.is_valid():
            answers_dict = serializer.validated_data.get('inputs') or request.data.get('inputs', {})
            
            if not answers_dict:
                return Response(
                    {"error": "The 'inputs' object cannot be empty or missing."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
          
            calc_results = CarbonCalculator.calculate(answers_dict)
            final_total = calc_results['total_footprint']
            final_score = calc_results['sustainability_score']
            breakdown_data = calc_results['breakdown']
            
            record = FootprintCalculation.objects.create(
                user=request.user if request.user.is_authenticated else None,
                quiz_input=answers_dict,  
                totalfootprint=final_total,
                sustainability=final_score, 
                food_footprint=breakdown_data['food'],
                transportation_footprint=breakdown_data['transportation'],
                energy_footprint=breakdown_data['energy'],
                shopping_footprint=breakdown_data['shopping'],
            )

            response_payload = FootprintResultSerializer(record).data
            response_payload['recommendations'] = calc_results['recommendations']
            
            return Response(response_payload, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)