import json
import os
from google import genai
from google.genai import types
from PIL import Image


def analyze_material_image(image_path):
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    image = Image.open(image_path)
    prompt = """
        Bertindaklah sebagai sistem Computer Vision penilai sisa material konstruksi. 
        Analisa gambar yang diberikan dan kembalikan hasilnya HANYA dalam format JSON dengan key: 
        nama_material, brand_terbaca, kategori, kondisi_fisik (deskripsi dan persentase), 
        estimasi_berat (berat_angka, satuan, catatan), layak_pakai (true/false), dan skor_kelayakan (0-100).
        """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[image, prompt],
        config=types.GenerateContentConfig(
            response_mime_type="application/json" 
        ),
    )
    return json.loads(response.text)