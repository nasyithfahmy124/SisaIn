from rest_framework import serializers
from django.contrib.auth.models import User
from .models import AkunProfile

class RegisterSeri(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True)
    class Meta:
        model = User
        fields = ['username','email','password']
    
    def create(self,validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email = validated_data.get('email',''),
            password=validated_data['password']
            
        )
        return user
    
class ProfileSeri(serializers.ModelSerializer):
    class Meta:
        model = AkunProfile
        fields = [
            'image',
            'first_name',
            'last_name',
            'email',
            'no_tlp',
            'gender',
            'alamat'
        ]
        read_only_fields = [
            'user',
            'email',
        ]
        
class UpdateProfileSeri(serializers.ModelSerializer):
    class Meta:
        model = AkunProfile
        fields =  [
            'image',
            'first_name',
            'last_name',
            'email',
            'no_tlp',
            'gender',
            'alamat'
        ]
        read_only_fields = [
            'user',
            'email',
        ]