
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *

@api_view(['GET'])
def dashboard(request):
    return Response({
        "metrics": MetricSerializer(Metric.objects.filter(category='dashboard'), many=True).data,
        "variationRows": VariationRowSerializer(VariationRow.objects.all(), many=True).data,
        "sectors": SectorSerializer(Sector.objects.all(), many=True).data,
        "ghgComposition": GhgCompositionSerializer(GhgComposition.objects.all(), many=True).data,
        "dataSources": DataSourceSerializer(DataSource.objects.all(), many=True).data,
    })

@api_view(['GET'])
def explorer(request):
    year = request.GET.get("year", None)
    sector = request.GET.get("sector", None)
    source = request.GET.get("source", None)
    country = request.GET.get("country", None)
    scope = request.GET.get("scope", None)

    q = ExplorerRow.objects.all()
    if year and not year.lower().startswith('all'): q = q.filter(year__iexact=year)
    if sector and not sector.lower().startswith('all'): q = q.filter(sector__iexact=sector)
    if source and not source.lower().startswith('all'): q = q.filter(source__iexact=source)
    if country and not country.lower().startswith('all'): q = q.filter(country__iexact=country)
    if scope and not scope.lower().startswith('all'): q = q.filter(scope__iexact=scope)

    rows = ExplorerRowSerializer(q, many=True).data
    return Response({
        "rows": rows,
        "count": len(rows)
    })

@api_view(['GET'])
def compare(request):
    return Response({
        "rows": ComparisonRowSerializer(ComparisonRow.objects.all(), many=True).data,
        "peers": PeerRowSerializer(PeerRow.objects.all(), many=True).data,
        "complianceRows": ComplianceRowSerializer(ComplianceRow.objects.all(), many=True).data,
    })

@api_view(['GET'])
def per_capita(request):
    return Response({
        "metrics": MetricSerializer(Metric.objects.filter(category='per_capita'), many=True).data,
        "bars": PerCapitaBarSerializer(PerCapitaBar.objects.all(), many=True).data,
        "context": {
            "title": 'The "Low Global Impact" Context',
            "summary": (
                "Despite year-on-year increases, Nepal's per capita output remains "
                "among the lowest globally. The platform frames that headroom "
                "against climate exposure, infrastructure growth, and Paris pathway targets."
            ),
        },
        "vulnerability": [
            ["Climate Exposure", "Extreme"],
            ["Adaptation Need", "Urgent"],
            ["Contribution", "0.027%"],
        ],
    })

@api_view(['GET'])
def sources(request):
    return Response({
        "dataSources": DataSourceSerializer(DataSource.objects.all(), many=True).data,
        "networkIntegrity": NetworkIntegritySerializer(NetworkIntegrity.objects.all(), many=True).data,
    })

@api_view(['GET'])
def admin(request):
    return Response({
        "metrics": MetricSerializer(Metric.objects.filter(category='admin'), many=True).data,
        "pipelineRows": PipelineRowSerializer(PipelineRow.objects.all(), many=True).data,
        "surveyQueue": SurveyQueueSerializer(SurveyQueue.objects.all(), many=True).data,
        "users": AdminUserSerializer(AdminUser.objects.all(), many=True).data,
        "auditLog": AuditLogSerializer(AuditLog.objects.all(), many=True).data,
    })

@api_view(['POST'])
def contact(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status": "received",
            "message": f"Thanks {serializer.validated_data['full_name']}. The Ecoberg team will respond to {serializer.validated_data['email']}."
        })
    return Response(serializer.errors, status=400)
