import pytesseract
from PIL import Image
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def process_image_with_ocr(image_path):
    try:
        image = Image.open(image_path).convert("RGB")
        ocr_data = pytesseract.image_to_string(image)
        return ocr_data.strip()
    except Exception as e:
        print(f"Error processing the image: {e}")
        return None
def classify_invoice_type(ocr_text):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that categorizes invoices."},
                {"role": "user", "content": f"Based on the following invoice text, categorize the invoice type. Provide a single word answer.\n\n{ocr_text}"}
            ],
            temperature=0.3,
            max_tokens=10
        )

        invoice_type = response['choices'][0]['message']['content'].strip()
        return invoice_type
    
    except Exception as e:
        print(f"Error classifying the invoice: {e}")
        return None

# Example usage
image_path = "testingdata.jpg"
ocr_text = process_image_with_ocr(image_path)

if ocr_text:
    invoice_category = classify_invoice_type(ocr_text)
    print(f"Invoice Category: {invoice_category}")
else:
    print("No text found in the image.")
