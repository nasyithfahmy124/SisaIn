import os
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from supabase import create_client, Client

class SupabaseStorage(Storage):
    def __init__(self):
        # Mengambil nilai dari environment variables (.env)
        self.base_url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_KEY")
        self.bucket_name = os.environ.get("SUPABASE_BUCKET_NAME", "sisain")
        
        if not self.base_url or not self.key:
            raise ValueError("SUPABASE_URL dan SUPABASE_KEY harus diatur di file .env!")
            
        self.supabase: Client = create_client(self.base_url, self.key)

    def _save(self, name, content):
        clean_name = name.replace('\\', '/')
        file_data = content.read()
        content_type = "image/jpeg" 
        if clean_name.lower().endswith('.png'):
            content_type = "image/png"
        elif clean_name.lower().endswith('.gif'):
            content_type = "image/gif"
        elif clean_name.lower().endswith('.webp'):
            content_type = "image/webp"

        print(f"Sedang mencoba upload {clean_name} ({content_type}) ke bucket {self.bucket_name}...")
        
        try:
            res = self.supabase.storage.from_(self.bucket_name).upload(
                path=clean_name,
                file=file_data,
                file_options={
                    "cache-control": "3600", 
                    "upsert": "true",
                    "content-type": content_type 
                }
            )
        except Exception as upload_error:
            print("LOG ERROR UPLOAD SUPABASE:", str(upload_error))
            raise upload_error
            
        return clean_name

    def url(self, name):
        clean_name = name.replace('\\', '/')
        return f"{self.base_url}/storage/v1/object/public/{self.bucket_name}/{clean_name}"

    def exists(self, name):
        return False

    def get_available_name(self, name, max_length=None):
        clean_name = name.replace('\\', '/')
        return clean_name