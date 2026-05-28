from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny 
from .serializers import FootprintResultSerializer
from .calculator import CarbonCalculator

class Calculate_Footprint(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = FootprintResultSerializer(data=request.data)
        
        if serializer.is_valid():
            answers = serializer.validated_data['inputs']
     
            results = CarbonCalculator.calculate(answers)
            
            record = serializer.save(
                user=request.user if request.user.is_authenticated else None,
                total_footprint=results['total_footprint'],
                sustainability_score=results['sustainability_score'],
                food_value=results['breakdown']['food'],
                transport_value=results['breakdown']['transportation'],
                energy_value=results['breakdown']['energy'],
                shopping_value=results['breakdown']['shopping'],
            )
            
            # 4. Return the full saved database record along with the dynamic recommendations
            response_payload = FootprintResultSerializer(record).data
            response_payload['recommendations'] = results['recommendations']
            
            return Response(response_payload, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)