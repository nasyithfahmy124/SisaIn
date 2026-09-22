from rest_framework import serializers
from .models import AIAnalisis

class ChatRekomendasiSerializer(serializers.Serializer):
    pesan = serializers.CharField(
        required=True, 
        help_text="Contoh: Saya mau membuat pondasi rumah"
    )
    
class AIAnalisisSeri(serializers.ModelSerializer):
    class Meta:
        model = AIAnalisis
        fields = ["id", "image", "result_data", "created"]
        read_only_fields = [
            "result_data",
            "created_at",
            ]  