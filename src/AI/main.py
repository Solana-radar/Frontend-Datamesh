from flask import Flask, request, jsonify
import pytesseract
from PIL import Image
import openai
import os
from io import BytesIO

app = Flask(__name__)

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

@app.route("/process-invoice/", methods=["POST"])
def process_invoice():
    try:
        file = request.files["file"]
        image_bytes = file.read()
        ocr_text = process_image_with_ocr(image_bytes)
        if not ocr_text:
            return jsonify({"error": "No text found"}), 400
        
        invoice_category = classify_invoice_type(ocr_text)
        return jsonify({"ocr_text": ocr_text, "category": invoice_category})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = os.getenv("PORT", 5000)
    app.run(host="0.0.0.0", port=port)
