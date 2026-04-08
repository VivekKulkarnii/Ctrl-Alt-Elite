from fastapi import FastAPI, Request, Form
from twilio.rest import Client
import httpx
import os
from PyPDF2 import PdfReader
import io

app = FastAPI()
def extract_text_from_pdf(file_bytes):
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

# Your credentials
TWILIO_SID = "AC438b3f6a6ba23cd64cf2a6e863e02998"
TWILIO_TOKEN = "7ba96bc01348c0fa7e7d90f424be72d2"
TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886"  # Twilio sandbox number
GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"

twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

async def ask_groq(text: str) -> str:
    system_prompt = """You are LexAI — an expert AI legal assistant. 
    The user will send you legal text or questions about legal documents.
    Analyze it and respond in simple plain English.
    Always highlight:
    - Key risks (mark as 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW)
    - Important obligations
    - What the user should watch out for
    Keep your response concise and WhatsApp-friendly (no markdown, use emojis instead).
    End with one clear recommendation."""

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": GROQ_MODEL,
                "max_tokens": 1024,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text}
                ]
            },
            timeout=30.0
        )
        data = response.json()
        print(data)
        # Debug print (helps you see what Groq returns)
        print("GROQ RESPONSE:", data)

# Handle error case
        if "choices" not in data:
            if "error" in data:
                return f"⚠️ AI Error: {data['error']['message']}"
            return "⚠️ AI is currently unavailable. Please try again."

# Normal response
        return data["choices"][0]["message"]["content"].strip()

@app.get("/")
def root():
    return {"status": "LexAI WhatsApp Bot running ⚖️"}

@app.post("/webhook")
async def whatsapp_webhook(
    Body: str = Form(""),
    From: str = Form(...),
    NumMedia: str = Form("0"),
    MediaUrl0: str = Form(None)
):
    print(f"Message from {From}: {Body}")

    # Show typing indicator (send immediate ack)
    user_number = From  # e.g. whatsapp:+919876543210

    try:
        # Get AI analysis
        if int(NumMedia) > 0:
    # 📄 FILE RECEIVED
            file_url = MediaUrl0
            print("Received file:", file_url)

            async with httpx.AsyncClient() as client:
                file_response = await client.get(
                    file_url,
                    auth=(TWILIO_SID, TWILIO_TOKEN),
                    follow_redirects=True
                )

                file_bytes = file_response.content

            print("FILE SIZE:", len(file_bytes))

            if not file_bytes.startswith(b'%PDF'):
                print("❌ Not a valid PDF")
                ai_response = "⚠️ Failed to download valid PDF."
            else:
                text = extract_text_from_pdf(file_bytes)
                ai_response = await ask_groq(text)

        else:
        # 📝 NORMAL TEXT MESSAGE
            ai_response = await ask_groq(Body)

        # Send reply back on WhatsApp
        twilio_client.messages.create(
            body=f"⚖️ *LexAI Analysis*\n\n{ai_response}",
            from_=TWILIO_WHATSAPP_FROM,
            to=user_number
        )
    except Exception as e:
        print(f"Error: {e}")
        twilio_client.messages.create(
            body="⚠️ Sorry, I couldn't analyze that. Please try again.",
            from_=TWILIO_WHATSAPP_FROM,
            to=user_number
        )

    return {"status": "ok"}