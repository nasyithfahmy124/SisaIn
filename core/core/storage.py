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
            raise ValueError("SUPABASE_URL dan SUPABASE_KEY belum diatur!")
            
        self.supabase: Client = create_client(self.base_url, self.key)

    def _save(self, name, content):
        # Bersihkan path dari backslash Windows
        clean_name = name.replace('\\', '/')
        
        # Baca file ke memory bytes (tidak disimpan ke hard disk lokal)
        file_data = content.read()
        
        # Tentukan Content-Type
        content_type = "image/jpeg"
        lower_name = clean_name.lower()
        if lower_name.endswith('.png'):
            content_type = "image/png"
        elif lower_name.endswith('.webp'):
            content_type = "image/webp"
        elif lower_name.endswith('.gif'):
            content_type = "image/gif"
        elif lower_name.endswith('.pdf'):
            content_type = "application/pdf"

        print(f"[SupabaseStorage] Mengunggah {clean_name} ke bucket '{self.bucket_name}'...")
        
        try:
            # Upload langsung ke Supabase Storage API
            res = self.supabase.storage.from_(self.bucket_name).upload(
                path=clean_name,
                file=file_data,
                file_options={
                    "cache-control": "3600", 
                    "upsert": "true",
                    "content-type": content_type 
                }
            )
            # Validasi jika supabase-py mengembalikan error di dalam respons
            if isinstance(res, dict) and res.get("error"):
                raise Exception(res.get("error"))
                
        except Exception as upload_error:
            print("[SupabaseStorage] GAGAL UPLOAD:", str(upload_error))
            raise upload_error
            
        return clean_name

    def _open(self, name, mode='rb'):
        # Karena di production (Vercel) server bersifat read-only, 
        # file dibaca langsung via URL publik Supabase jika dibutuhkan.
        pass

    def url(self, name):
        clean_name = name.replace('\\', '/')
        return f"{self.base_url}/storage/v1/object/public/{self.bucket_name}/{clean_name}"

    def exists(self, name):
        # Selalu return False agar Django menyerahkan proses penyimpanan murni ke method _save di atas
        return False

    def get_available_name(self, name, max_length=None):
        return name.replace('\\', '/')