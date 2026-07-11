from google import genai
from app.core.config import GEMINI_API_KEY
from pypdf import PdfReader
client = genai.Client(api_key=GEMINI_API_KEY)


def analyze_text(text: str):
    prompt = f"""
Kamu adalah AI yang membantu dosen mengevaluasi tugas mahasiswa.

Tugasmu:

2. Buat tepat 5 pertanyaan singkat berdasarkan isi teks.
3. Jawaban setiap pertanyaan tidak HARUS terdapat pada teks namun HARUS menuju pada konteks teks.
4. Jangan membuat pertanyaan di luar isi teks.
5. Gunakan Bahasa Indonesia.
6. Jangan memberikan salam atau kalimat pembuka.

Format jawaban:

Pertanyaan:
1.
2.
3.
4.
5.

Teks mahasiswa:

{text}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt,
        )
        return {
            "success": True,
            "questions": response.text
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

def analyze_answer(answer: str):
    return analyze_text(answer)

def extract_pdf_text(file_path: str):
    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text


def generate_questions_from_pdf(file_path: str):
    text = extract_pdf_text(file_path)

    return analyze_text(text)
