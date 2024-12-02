from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pytesseract
from PIL import Image
import openai
import os
from io import BytesIO

app = FastAPI()
import os
port = os.getenv("PORT", 5000)
app.run(host='0.0.0.0', port=port)

# Load API key
openai.api_key = os.getenv("OPENAI_API_KEY")

def process_image_with_ocr(image_bytes):
    try:
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        ocr_data = pytesseract.image_to_string(image)
        return ocr_data.strip()
    except Exception as e:
        return f"Error processing the image: {e}"

def classify_invoice_type(ocr_text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that categorizes invoices."},
                {"role": "user", "content": f"Categorize the invoice type. Provide a single word:\n\n{ocr_text}"}
            ],
            temperature=0.3,
            max_tokens=10
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"Error classifying the invoice: {e}"

@app.post("/process-invoice/")
async def process_invoice(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        ocr_text = process_image_with_ocr(image_bytes)
        if not ocr_text:
            return JSONResponse(content={"error": "No text found"}, status_code=400)
        
        invoice_category = classify_invoice_type(ocr_text)
        return {"ocr_text": ocr_text, "category": invoice_category}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
