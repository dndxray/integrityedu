from app.services.ai_service import analyze_pdf

result = analyze_pdf(
    "app/uploads/submissions/Outline - ITDP .pdf"
)

print(result)