from django.urls import include, path
from rest_framework import routers
from app.views import DetectionViewSet, ShannonScoreWeightsDetail

router = routers.DefaultRouter()
router.register(r'detections', DetectionViewSet, basename='detection')
# router.register(r'shannon-score-weights', ShannonScoreWeightsViewSet, basename='shannonscoreweights') # trying something else

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/shannon-score-weights/<int:pk>/', ShannonScoreWeightsDetail.as_view(), name='shannon-score-weights-detail'),
]