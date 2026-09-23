import os
from django.core.files.storage import Storage
from supabase import create_client, Client

class SupabaseStorage(Storage):
    def __init__(self, option=None):
        super().__init__()
        self.base_url = os.environ.get("SUPABASE_URL")
        self.key = os.environ.get("SUPABASE_KEY")
        self.bucket_name = os.environ.get("SUPABASE_BUCKET_NAME", "sisain")
        
        if not self.base_url or not self.key:
            raise ValueError("SUPABASE_URL dan SUPABASE_KEY harus diatur di Environment Variables Vercel!")
            
        self.supabase: Client = create_client(self.base_url, self.key)

    def _save(self, name, content):
        clean_name = name.replace('\\', '/')
        file_data = content.read()
        
        # Deteksi content type secara dinamis
        content_type = "image/jpeg"
        lower_name = clean_name.lower()
        if lower_name.endswith('.png'):
            content_type = "image/png"
        elif lower_name.endswith('.gif'):
            content_type = "image/gif"
        elif lower_name.endswith('.webp'):
            content_type = "image/webp"
        elif lower_name.endswith('.pdf'):
            content_type = "application/pdf"

        print(f"Mencoba upload {clean_name} ({content_type}) ke bucket Supabase: {self.bucket_name}...")
        
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
            # Cek jika library supabase mengembalikan error di dalam objek respons
            if isinstance(res, dict) and res.get("error"):
                raise Exception(res.get("error"))
                
        except Exception as upload_error:
            print("LOG ERROR UPLOAD SUPABASE:", str(upload_error))
            raise upload_error
            
        return clean_name

    def url(self, name):
        clean_name = name.replace('\\', '/')
        return f"{self.base_url}/storage/v1/object/public/{self.bucket_name}/{clean_name}"

    def exists(self, name):
        # Kembalikan False agar Django menganggap file baru dan langsung memproses upload
        return False

    def get_available_name(self, name, max_length=None):
        clean_name = name.replace('\\', '/')
        return clean_name