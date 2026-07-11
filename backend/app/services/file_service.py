import os

from app.services.ai_service import analyze_text
from app.utils.pdf_utils import extract_text_from_pdf


def analyze_uploaded_file(file):

    filename = file.filename.lower()

    extension = os.path.splitext(filename)[1]

    if extension == ".txt":

        text = file.file.read().decode("utf-8")

        return analyze_text(text)

    elif extension == ".pdf":

        pdf_bytes = file.file.read()

        text = extract_text_from_pdf(pdf_bytes)

        return analyze_text(text)

    elif extension in [".jpg", ".jpeg", ".png"]:

        return {
            "success": False,
            "error": "Image belum diimplementasikan."
        }

    else:

        return {
            "success": False,
            "error": "Format file tidak didukung."
        }