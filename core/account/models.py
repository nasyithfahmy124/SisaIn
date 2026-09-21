from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AkunProfile(models.Model):
    GENDER_CHOICES = [
            ('Laki-laki', 'Laki-laki'),
            ('Perempuan', 'Perempuan'),
        ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to='profile_img', blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(unique=True)
    no_tlp = models.CharField(max_length=15, blank=True, null=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True, null=True)
    alamat = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.email

