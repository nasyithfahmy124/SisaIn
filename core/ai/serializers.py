from rest_framework import serializers

class ChatRekomendasiSerializer(serializers.Serializer):
    pesan = serializers.CharField(
        required=True, 
        help_text="Contoh: Saya mau membuat pondasi rumah"
    )