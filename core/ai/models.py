from django.db import models

class AIAnalisis(models.Model):
    image = models.ImageField(upload_to="ai_material_uploads/")
    result_data = models.JSONField(
        null=True, blank=True
    ) 
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analisis #{self.id} - {self.created_at}"