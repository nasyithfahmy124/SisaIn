from rest_framework import serializers
from .models import MaterialForm


class MaterialFormSerializer(serializers.ModelSerializer):
    # simulasi_pengiriman = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = MaterialForm
        fields = [
            'id',
            'user',
            'nama_pemilik',
            'no_hp',
            'nama_material',
            'kategori',
            'deskripsi',
            'bobot',
            'kondisi_barang',
            'image',
            'alamat',
            'lat',
            'longitude',
            'catatan',
            # 'simulasi_pengiriman'
        ]
        read_only_fields = ['id', 'user','created']
