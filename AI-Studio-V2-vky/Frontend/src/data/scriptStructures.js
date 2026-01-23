export const scriptCategories = [
  {
    id: "ai-audio",
    name: "AI Voice & Audio",
    description: "Speech, voice, and audio processing scripts",

    scripts: [
      {
        id: "tts-basic",
        title: "Text to Speech Generator (GPT-4o-mini-tts)",
        featured: false,
        // PRODUCT SIGNALS
        tier: "pro",
        cost: "Low ($0.015 / 1k chars)",
        quality: "Production",
        verified: true,

        models: ["gpt-4o-mini-tts"],
        infra: ["OpenAI Audio API"],

        description:
          "Convert text into natural sounding speech using OpenAI’s low-latency production TTS model.",
        tags: ["tts", "audio", "voice", "openai", "speech", "ai-audio"],
        language: "Python",
        difficulty: "Easy",

        why:
          "Most TTS examples online use deprecated models or slow pipelines. This script is wired to OpenAI’s newest low-latency voice model used in real AI products, optimized for conversational agents and narration.",

        useCases: [
          "AI chatbots with voice",
          "Video narration",
          "Accessibility readers",
          "Voice-enabled SaaS apps",
          "Call center automation"
        ],

        readme: `
### What this does
Converts plain text into natural-sounding speech using OpenAI’s production-grade text-to-speech model.

### Why Nexus provides this
Most TTS tutorials online use outdated models or low-quality voices. Nexus provides this version because it uses the same OpenAI voice stack we run in production AI applications.

### Performance
Latency: ~200–400ms  
Voice quality: Human-like  
Scalability: Production ready  

### Cost
Approx. $0.015 per 1,000 characters.

### When not to use this
Do not use if you need offline or fully local TTS.
This requires OpenAI API access.
`,

        code: {
          main: `import os
from openai import OpenAI


def text_to_speech(text: str, output_file: str = "output.mp3"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.audio.speech.create(
        model="gpt-4o-mini-tts",
        voice="alloy",
        input=text,
    )
    with open(output_file, "wb") as f:
        f.write(response)
    print(f"Saved audio to {output_file}")


if __name__ == "__main__":
    user_text = input("Enter text: ")
    text_to_speech(user_text)`,
          requirements: `pip install openai`
        },

        usage:
          "Set OPENAI_API_KEY, save as tts_basic.py, run: python tts_basic.py, then type text to generate voice."
      },

        {
      id: "tts-studio-hd",
      title: "Text to Speech Generator (GPT-4o-realtime-preview)",
      featured: false,
      //  PAID PRODUCT
      tier: "pro",
      cost: "Medium ($0.12 / 1k chars)",
      quality: "Studio",
      verified: true,

      models: ["gpt-4o-realtime-preview", "gpt-4o-mini-tts-hd"],
      infra: ["OpenAI Realtime Audio API"],

      description:
        "Generate ultra-realistic, studio-quality speech for videos, ads, and professional narration using OpenAI’s premium voice models.",

      tags: ["tts", "voice", "narration", "openai", "realtime", "hd-audio"],
      language: "Python",
      difficulty: "Medium",

      why:
        "Basic TTS is not enough for commercial use. This script uses OpenAI’s premium real-time voice engine that delivers broadcast-quality output suitable for marketing, podcasts, and AI agents.",

      useCases: [
        "YouTube & video narration",
        "Marketing voice-overs",
        "AI avatars",
        "Call center AI agents",
        "Podcast generation"
      ],

      readme: `
    ### What this does
    Generates studio-quality speech using OpenAI’s premium real-time voice model.

    ### Why this is Pro
    This uses OpenAI’s HD voice engine, which is significantly more expensive but produces broadcast-ready audio.

    ### Audio Quality
    • Natural breathing & pacing  
    • Emotion and intonation  
    • Human-level clarity  

    ### Cost
    ~$0.12 per 1,000 characters.

    ### When to use this
    Use this when you are producing:
    • Videos  
    • Ads  
    • Podcasts  
    • Voice-enabled AI agents

    Not intended for cheap bulk TTS.
    `,

      code: {
        main: `import os
    from openai import OpenAI

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate_studio_voice(text: str, output_file="studio_voice.wav"):
        response = client.audio.speech.create(
            model="gpt-4o-mini-tts-hd",
            voice="alloy",
            format="wav",
            input=text,
        )

        with open(output_file, "wb") as f:
            f.write(response)

        print(f"Studio-grade voice saved to {output_file}")

    if __name__ == "__main__":
        script = input("Enter narration text: ")
        generate_studio_voice(script)
    `,
        requirements: `pip install openai`
      },

      usage:
        "Requires OpenAI paid plan. Set OPENAI_API_KEY, then run: python studio_tts.py and enter narration text."
        },


      {
        id: "tts-deepgram-free",
        title: "Text to Speech Generator (Deepgram)",
        featured: true,
        // 🟢 FREE TIER
        tier: "free",
        cost: "Free (Deepgram free tier)",
        quality: "Production",
        verified: true,

        models: ["aura-2-thalia-en"],
        infra: ["Deepgram Realtime TTS"],

        description:
          "Generate real-time natural voice using Deepgram’s streaming TTS model. Used in Nexus products for live AI voice output.",

        tags: ["tts", "voice", "deepgram", "realtime", "audio", "speech"],
        language: "Python",
        difficulty: "Medium",

        why:
          "This is the same Deepgram streaming TTS script used inside Nexus AI. Unlike most of scripts, it supports real-time low-latency audio streaming suitable for live assistants and voice agents.",

        useCases: [
          "Live AI assistants",
          "Voice chatbots",
          "Voice interfaces",
          "Accessibility tools"
        ],

        readme: `
      ### What this does
      Converts text into natural human-sounding speech using Deepgram’s real-time voice model.

      ### Why this is FREE
      Deepgram provides a generous free tier that supports real-time TTS. 
      This script uses that tier and does not require paid OpenAI or Claude APIs.

      ### Performance
      • Real-time streaming  
      • Low latency  
      • Natural voice  

      ### Model
      Uses Deepgram model: aura-2-thalia-en

      ### When to use this
      Use this when you need:
      • Live audio output  
      • Voice chatbots  
      • Streaming TTS  

      ### When not to use
      Do not use for offline batch narration or studio voiceover — use Pro/Best scripts instead.
      `,

        code: {
          main: `
      import time
      import logging
      from deepgram import DeepgramClient, SpeakOptions
      import os

      class ConvertToSpeech:
          @staticmethod
          async def text_to_speech(text: str, api_key: str) -> bytes | None:
              try:
                  deepgram = DeepgramClient(api_key)
                  model = os.getenv("DEEPGRAM_TTS_MODEL", "aura-2-thalia-en").strip()
                  options = SpeakOptions(model=model)
                  response = deepgram.speak.v("1").stream_memory({"text": text}, options)
                  return response.stream.getvalue()
              except Exception as e:
                  logging.error(f"TTS error: {e}")
                  return None

      import base64
      import os
      import time
      from fastapi import APIRouter, HTTPException
      from pydantic import BaseModel
      from services.tts import ConvertToSpeech

      app = APIRouter()

      class TTSRequest(BaseModel):
          text: str

      @app.post("/text-to-speech")
      async def text_to_speech_api(request: TTSRequest):
          start_time = time.time()

          try:
              deepgram_api_key = os.getenv("DEEPGRAM_API_KEY")
              if not deepgram_api_key:
                  raise HTTPException(status_code=500, detail="DEEPGRAM_API_KEY not found")

              if not request.text.strip():
                  raise HTTPException(status_code=400, detail="Text input is empty")

              if len(request.text) > 2000:
                  raise HTTPException(status_code=400, detail="Text exceeds 2000 character limit")

              audio_response = await ConvertToSpeech.text_to_speech(request.text, deepgram_api_key)

              if audio_response:
                  audio_base64 = base64.b64encode(audio_response).decode("utf-8")
                  return {
                      "audio": audio_base64,
                      "audio_format": "mp3"
                  }

              raise HTTPException(status_code=500, detail="Failed to generate speech")
          except Exception as e:
              raise HTTPException(status_code=500, detail=str(e))`,
          
          requirements: `pip install deepgram-sdk fastapi pydantic`
        },

        usage:
          "Set DEEPGRAM_API_KEY, run FastAPI server, then call POST /text-to-speech with JSON { text: 'Hello world' }."
      }
    ]
  },
  {
    id: "computer-vision",
    name:"Computer Vision",
    description:"Computer Vision",

    scripts: [
    {
      id: "vision-blip2-analyzer",
      title: "Free Image Intelligence Engine (BLIP-2)",
      featured: false,

      tier: "free",
      cost: "Free (HuggingFace Inference API)",
      quality: "Production",
      verified: true,

      models: ["BLIP-2"],
      infra: ["HuggingFace Inference API"],

      description:
        "Analyze images using BLIP-2 to detect objects, read visible text, and generate structured intelligence from photos and documents.",

      tags: ["cv", "ocr", "blip2", "free"],
      language: "Python",
      difficulty: "Easy",

      why:
        "This is a free, production-grade multimodal vision model that converts images into structured insights without requiring any paid API.",

      useCases: [
        "Invoice & receipt understanding",
        "ID & document reading",
        "Image-based Q&A",
        "Product image analysis",
        "Visual inspection"
      ],

      readme: `
    ### What this does
    Takes any image and converts it into structured intelligence using BLIP-2, a powerful open-source multimodal AI.

    ### Capabilities
    • Image understanding  
    • Visual question answering  
    • OCR-like text extraction  
    • Scene and object reasoning  
    • Structured JSON output  

    ### Model
    BLIP-2 (Salesforce) via HuggingFace.

    ### When to use
    Use this when you need:
    • Free image analysis  
    • Visual document reading  
    • AI vision pipelines  

    ### When not to use
    Not designed for real-time video streams.
    `,

      code: {
        main: `
    import requests
    import base64
    import json
    import os

    HF_API_KEY = os.getenv("HF_API_KEY")

    MODEL_URL = "https://api-inference.huggingface.co/models/Salesforce/blip2-flan-t5-xl"

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}"
    }

    def analyze_image(image_path, prompt):
        with open(image_path, "rb") as f:
            image_bytes = f.read()

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        payload = {
            "inputs": {
                "image": image_base64,
                "question": prompt
            }
        }

        response = requests.post(MODEL_URL, headers=headers, json=payload)
        response.raise_for_status()

        result = response.json()

        return result[0]["generated_text"]

    def analyze_to_json(image_path):
        prompt = '''
    You are a vision AI.
    Analyze the image and return this JSON format:

    {
      "objects": [],
      "visible_text": "",
      "summary": "",
      "insights": []
    }
    '''
        raw = analyze_image(image_path, prompt)

        try:
            json_start = raw.find("{")
            json_data = raw[json_start:]
            return json.loads(json_data)
        except:
            return {
                "raw_output": raw
            }

    if __name__ == "__main__":
        img = input("Enter image path: ")
        result = analyze_to_json(img)
        print(json.dumps(result, indent=2))
        `,

        requirements: `
    pip install requests
    `
      },

      usage:
        "Set HF_API_KEY from huggingface.co, then run: python vision.py and provide an image path."
    }
,
    {
      id: "vision-gemini-damage-detection",
      title: "AI Damage Detection (Gemini)",
      featured: true,

      tier: "best",
      pricing: "paid",
      cost: "Low-Medium (Gemini)",
      quality: "Production",
      verified: true,

      models: ["gemini-2.5-flash-lite"],
      infra: ["Google Gemini Vision API", "OpenCV", "PIL"],

      description:
        "Detect, classify, and localize physical damage in images using Gemini Vision with structured JSON output and confidence scores. Used in ViziSmart for damage analysis and classification.",

      tags: ["cv", "gemini","inspection", "ocr", "image-ai"],
      language: "Python",
      difficulty: "Medium",

      why:
        "This is not a toy detector. It uses Gemini's multimodal reasoning to understand what the damage is, where it is, and how severe it is.",

      useCases: [
        "Insurance claims",
        "Property damage analysis",
        "Quality inspection",
        "Remote audits"
      ],

      readme: `
    ### What this does
    Uploads an image (e.g. property, equipment) and returns structured damage intelligence:
    • Damage type
    • Location
    • Severity
    • Confidence score
    • Explanation

    ### Why this is BEST
    This is the exact Gemini Vision pipeline used inside ViziSmart to process real customer images.

    ### Capabilities
    • Visual reasoning (not just bounding boxes)  
    • OCR + semantic understanding  
    • Structured JSON output  
    • Cost-optimized image handling  

    ### Model
    Gemini 2.5 Flash Lite

    ### When to use
    Use this when you need:
    • Insurance automation  
    • Inspection workflows  
    • Visual validation  
    • Damage assessment  

    ### When not to use
    Not designed for real-time video streaming (use frame pipelines for that).
    `,

      code: {
        main: `
    import os
    import json
    import base64
    from PIL import Image
    import google.generativeai as genai

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel("gemini-2.5-flash-lite")

    def detect_damage(image_path):
        # Load and compress image to reduce cost
        img = Image.open(image_path)
        img = img.convert("RGB")
        img.save("tmp.jpg", quality=80)

        with open("tmp.jpg", "rb") as f:
            image_bytes = f.read()

        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        prompt = """
    You are an AI inspection engine.
    Analyze this image and return JSON with:
    - damage_type
    - location
    - severity (low | medium | high)
    - confidence (0–1)
    - explanation
    """

        response = model.generate_content([
            prompt,
            { "mime_type": "image/jpeg", "data": image_base64 }
        ])

        try:
            return json.loads(response.text)
        except:
            return { "raw_response": response.text }

    if __name__ == "__main__":
        path = input("Enter image path: ")
        result = detect_damage(path)
        print(json.dumps(result, indent=2))
    `,
        requirements: `pip install google-generativeai pillow`
      },

      usage:
        "Set GEMINI_API_KEY, then run: python vision_damage.py and provide an image path to get structured damage intelligence."
    }
    ]
  },

  {
    id: "translation",
    name: "Language Intelligence",
    description: "Scripts for offline and zero-cost translation of legal and professional documents",

    scripts: [
      {
        id: "translation-marianmt-offline",
        title: "Legal Translation Engine (MarianMT)",
        featured: true,

        tier: "free",
        cost: "Free (Offline, Open Source)",
        quality: "Production",
        verified: true,

        models: ["Helsinki-NLP MarianMT"],
        infra: ["Transformers", "PyTorch"],

        description:
       "Translate legal and professional documents from English to French using MarianMT open-source neural models. Runs fully offline with no API keys or external calls.",

        tags: ["translation", "nlp", "offline", "legal", "free"],
        language: "Python",
        difficulty: "Medium",

        why:
          "This uses MarianMT, one of the most trusted open-source translation models, making it ideal for legal documents where data privacy and zero API cost are critical.",

        useCases: [
          "Legal document translation",
          "Contracts & agreements",
          "Compliance documentation",
          "Academic papers",
          "Privacy-sensitive text translation"
        ],

        readme: `
  ### What this does
  Translates text or documents between supported languages using MarianMT, a high-quality open-source neural translation model.

  ### Capabilities
  • Offline translation  
  • Legal-friendly formal language  
  • Multiple language pairs  
  • No API keys or internet required  
  • Deterministic and auditable  

  ### Model
  Helsinki-NLP MarianMT (Opus-MT series)

  ### When to use
  Use this when you need:
  • Zero-cost translation  
  • Data privacy  
  • Legal or sensitive documents  

  ### When not to use
  Not ideal for real-time conversational translation.
        
  ### Language Direction
This script currently translates:

**English → French**

(Model: Helsinki-NLP/opus-mt-en-fr)

### How to change languages
MarianMT models follow this format:

Helsinki-NLP/opus-mt-<source>-<target>

Examples:
• opus-mt-en-de → English → German  
• opus-mt-en-es → English → Spanish  
• opus-mt-fr-en → French → English  
• opus-mt-mul-en → Multiple languages → English  

To change languages, simply update the MODEL_NAME variable in the code.

  `,

        code: {
          main: `
  from transformers import MarianMTModel, MarianTokenizer

  MODEL_NAME = "Helsinki-NLP/opus-mt-en-fr"

  tokenizer = MarianTokenizer.from_pretrained(MODEL_NAME)
  model = MarianMTModel.from_pretrained(MODEL_NAME)

  def translate(text):
      tokens = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
      translated = model.generate(**tokens)
      return tokenizer.decode(translated[0], skip_special_tokens=True)

  if __name__ == "__main__":
      text = input("Enter text to translate: ")
      print(translate(text))
          `,

          requirements: `
  pip install transformers torch sentencepiece
          `
        },

        usage:
          "Install requirements and run: python translate.py. Change MODEL_NAME for different language pairs."
      },

      {
        id: "translation-argos-offline",
        title: "Document Translator (Argos Translate)",
        featured: false,

        tier: "free",
        cost: "Free (Open Source, Offline)",
        quality: "Production",
        verified: true,

        models: ["Argos Translate"],
        infra: ["Argos Translate Engine"],

        description:
          "Translate documents locally using Argos Translate, a lightweight open-source neural translation engine with no API or internet dependency.",

        tags: ["translation", "offline", "argos", "free"],
        language: "Python",
        difficulty: "Easy",

        why:
          "Argos Translate offers an easy-to-use offline translation pipeline suitable for batch document translation with minimal setup.",

        useCases: [
          "Batch document translation",
          "Student projects",
          "Local compliance workflows"
        ],

        readme: `
  ### What this does
  Provides a simple offline translation engine using Argos Translate with downloadable language packages.

  ### Capabilities
    • Fully offline translation  
    • Lightweight setup  
    • Multiple language support  
    • No API keys
    • Smart package caching (downloads once, reuses forever)

  ### Model
  Argos Neural Translation Models

  ### When to use
  Use this when you need:
    • Simple offline translation  
    • Low resource usage  
    • Quick setup
    • Privacy (no data sent to external servers)

  ### When not to use
    Not optimized for very long or highly technical legal documents.
    Translation quality may be lower than cloud-based models like DeepL or Google Translate.
        `,

        code: {
          main: `
        from argostranslate import package, translate
        import argostranslate.package

        # Update package index
        package.update_package_index()
        available_packages = package.get_available_packages()

        # Install en->fr package if not already installed
        def ensure_package_installed(from_code, to_code):
            installed_packages = package.get_installed_packages()
            
            # Check if already installed
            for pkg in installed_packages:
                if pkg.from_code == from_code and pkg.to_code == to_code:
                    print(f"Package {from_code}->{to_code} already installed")
                    return
            
            # Install if not found
            print(f"Installing {from_code}->{to_code} package...")
            pkg_to_install = next(
                (p for p in available_packages if p.from_code == from_code and p.to_code == to_code),
                None
            )
            
            if pkg_to_install:
                package.install_from_path(pkg_to_install.download())
                print("Package installed successfully!")
            else:
                raise Exception(f"Package {from_code}->{to_code} not found")

        # Ensure package is installed
        ensure_package_installed("en", "fr")

        # Translate
        text = input("Enter text to translate (EN->FR): ")
        translated = translate.translate(text, "en", "fr")
        print(f"Translation: {translated}")
                `,

      requirements: `pip install argostranslate`
        },

        usage:
          "Install requirements and run: python argos_translate.py. Language packs download once and run offline."
      }
    ]
  }


  
];



//   {
//     id: "nlp",
//     name: "Natural Language Processing (NLP)",
//     description: "Text-focused utilities for ML/NLP workflows",
//     scripts: [
//       {
//         id: "rag-retrieval-chunker",
//         title: "RAG Retrieval Chunker",
//         description:
//           "Split long documents into overlapping chunks with IDs for vector DB retrieval.",
//         tags: ["rag", "retrieval", "chunking", "embeddings"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `from typing import List, Dict


// def chunk_for_retrieval(
//     text: str,
//     chunk_size: int = 800,
//     overlap: int = 120,
//     doc_id: str | None = None,
// ) -> List[Dict]:
//     """
//     Character-based chunking for RAG.
//     Returns a list of {id, doc_id, index, content}.
//     """
//     chunks: List[Dict] = []
//     start = 0
//     idx = 0

//     while start < len(text):
//         end = start + chunk_size
//         content = text[start:end]
//         if not content.strip():
//             break

//         chunks.append(
//             {
//                 "id": f"{doc_id or 'doc'}_{idx}",
//                 "doc_id": doc_id,
//                 "index": idx,
//                 "content": content,
//             }
//         )

//         idx += 1
//         start = end - overlap
//         if start < 0:
//             start = 0

//     return chunks


// if __name__ == "__main__":
//     sample_text = "This is an example long document..." * 200
//     result = chunk_for_retrieval(sample_text, chunk_size=500, overlap=100, doc_id="sample-doc")
//     print(f"Created {len(result)} chunks")
//     print("First chunk id:", result[0]["id"])
//     print("First chunk preview:", result[0]["content"][:200])`,
//           requirements: `Python 3.10+ (standard library only)`,
//         },
//         usage:
//           "Use chunk_for_retrieval before embedding and upserting chunks into a vector store.",
//       },

//       {
//         id: "text-clean-token-count",
//         title: "Text Cleaner & Token Approx",
//         description:
//           "Clean text and approximate token count (word-based) for cost estimation.",
//         tags: ["nlp", "preprocessing", "tokens"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `import re


// def clean_text(text: str) -> str:
//     text = text.strip()
//     text = re.sub(r"\\s+", " ", text)
//     return text


// def approx_token_count(text: str) -> int:
//     # crude approximation: 1 token ≈ 0.75 words
//     words = len(text.split())
//     return int(words / 0.75)


// if __name__ == "__main__":
//     sample = "Hello,\\n\\nThis   is   a   sample   text!  "
//     cleaned = clean_text(sample)
//     print("Cleaned:", cleaned)
//     print("Approx tokens:", approx_token_count(cleaned))`,
//           requirements: `Python 3.x (standard library only)`,
//         },
//         usage:
//           "Use before sending prompts to estimate token usage and trim long inputs.",
//       },

//       {
//         id: "json-formatter",
//         title: "JSON Formatter",
//         description: "Format and validate JSON payloads (for labels, configs, LLM output).",
//         tags: ["json", "utility"],
//         language: "JavaScript",
//         difficulty: "Easy",
//         code: {
//           main: `export function formatJson(input) {
//   try {
//     const parsed = JSON.parse(input);
//     return JSON.stringify(parsed, null, 2);
//   } catch (e) {
//     return "Invalid JSON: " + e.message;
//   }
// }`,
//           requirements: `Runs in browser or Node.js (no extra deps)`,
//         },
//         usage:
//           "Use in your UI to pretty-print and validate JSON responses or annotation files.",
//       },
//     ],
//   },

  // {
  //   id: "data-utils",
  //   name: "Data & Utilities",
  //   description: "Reusable building blocks for ML pipelines (EDA, splits, training, eval).",
  //   scripts: [
      
//       {
//         id: "train-test-split",
//         title: "Train/Test Split Helper",
//         description: "Create stratified train/test splits and save to disk.",
//         tags: ["sklearn", "split", "tabular"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `import pandas as pd
// from sklearn.model_selection import train_test_split


// def make_splits(path: str, target: str, test_size: float = 0.2, random_state: int = 42):
//     df = pd.read_csv(path)
//     train_df, test_df = train_test_split(
//         df, test_size=test_size, random_state=random_state, stratify=df[target]
//     )
//     train_df.to_csv("train.csv", index=False)
//     test_df.to_csv("test.csv", index=False)
//     print("Saved train.csv and test.csv")


// if __name__ == "__main__":
//     import sys
//     if len(sys.argv) != 3:
//         print("Usage: python make_splits.py data.csv target_column")
//     else:
//         make_splits(sys.argv[1], sys.argv[2])`,
//           requirements: `pip install pandas scikit-learn`,
//         },
//         usage:
//           "Use on labeled datasets: python make_splits.py data.csv label_column.",
//       },

//       {
//         id: "train-sklearn-classifier",
//         title: "Train & Save Sklearn Classifier",
//         description: "Train a RandomForest baseline and save it with joblib.",
//         tags: ["sklearn", "model", "training"],
//         language: "Python",
//         difficulty: "Medium",
//         code: {
//           main: `import pandas as pd
// from sklearn.model_selection import train_test_split
// from sklearn.ensemble import RandomForestClassifier
// from sklearn.metrics import classification_report
// import joblib


// def train_model(path: str, target: str, model_path: str = "model.joblib"):
//     df = pd.read_csv(path)
//     X = df.drop(columns=[target])
//     y = df[target]

//     X_train, X_val, y_train, y_val = train_test_split(
//         X, y, test_size=0.2, random_state=42, stratify=y
//     )

//     clf = RandomForestClassifier(n_estimators=200, random_state=42)
//     clf.fit(X_train, y_train)

//     y_pred = clf.predict(X_val)
//     print(classification_report(y_val, y_pred))

//     joblib.dump(clf, model_path)
//     print(f"Saved model to {model_path}")


// if __name__ == "__main__":
//     import sys
//     if len(sys.argv) != 3:
//         print("Usage: python train_model.py data.csv target_column")
//     else:
//         train_model(sys.argv[1], sys.argv[2])`,
//           requirements: `pip install pandas scikit-learn joblib`,
//         },
//         usage:
//           "Run a quick baseline: python train_model.py data.csv target.",
//       },

//       {
//         id: "infer-sklearn-classifier",
//         title: "Load & Run Sklearn Model",
//         description: "Run inference with a saved sklearn model on new CSV data.",
//         tags: ["sklearn", "inference", "cli"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `import pandas as pd
// import joblib


// def run_inference(model_path: str, data_path: str, out_path: str = "preds.csv"):
//     clf = joblib.load(model_path)
//     df = pd.read_csv(data_path)
//     preds = clf.predict(df)
//     df_out = df.copy()
//     df_out["prediction"] = preds
//     df_out.to_csv(out_path, index=False)
//     print(f"Saved predictions to {out_path}")


// if __name__ == "__main__":
//     import sys
//     if len(sys.argv) != 3:
//         print("Usage: python infer.py model.joblib data.csv")
//     else:
//         run_inference(sys.argv[1], sys.argv[2])`,
//           requirements: `pip install pandas scikit-learn joblib`,
//         },
//         usage:
//           "After training, run: python infer.py model.joblib new_data.csv to get preds.csv.",
//       },

//       {
//         id: "data-quality-check",
//         title: "Data Quality Checker",
//         description: "Check missing values and cardinality before model training.",
//         tags: ["eda", "validation", "pandas"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `import pandas as pd


// def data_quality_report(path: str):
//     df = pd.read_csv(path)
//     print("=== Shape ===")
//     print(df.shape)

//     print("\\n=== Missing values ===")
//     print(df.isna().sum().sort_values(ascending=False))

//     print("\\n=== Cardinality (unique counts) ===")
//     print(df.nunique().sort_values(ascending=False))

//     print("\\n=== Sample rows ===")
//     print(df.sample(min(5, len(df))))


// if __name__ == "__main__":
//     import sys
//     if len(sys.argv) != 2:
//         print("Usage: python data_quality.py data.csv")
//     else:
//         data_quality_report(sys.argv[1])`,
//           requirements: `pip install pandas`,
//         },
//         usage:
//           "Run: python data_quality.py data.csv to spot leakage columns, high cardinality, etc.",
//       },

//       {
//         id: "fetch-with-timeout",
//         title: "Fetch With Timeout (Model APIs)",
//         description: "Safer fetch wrapper for calling model inference endpoints.",
//         tags: ["http", "fetch", "frontend", "inference"],
//         language: "JavaScript",
//         difficulty: "Easy",
//         code: {
//           main: `export async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
//   const controller = new AbortController();
//   const id = setTimeout(() => controller.abort(), timeoutMs);

//   try {
//     const response = await fetch(url, {
//       ...options,
//       signal: controller.signal,
//       headers: {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//       },
//     });

//     const text = await response.text();
//     const data = text ? JSON.parse(text) : null;

//     if (!response.ok) {
//       throw new Error(data?.detail || data?.error || response.statusText);
//     }

//     return data;
//   } finally {
//     clearTimeout(id);
//   }
// }`,
//           requirements: `Runs in browser or modern Node.js (fetch + AbortController)`,
//         },
//         usage:
//           "Use in your frontend to call FastAPI/Flask inference endpoints with timeout + JSON error parsing.",
//       },

//       {
//         id: "word-to-pdf",
//         title: "Word to PDF Converter",
//         description: "Convert Word DOCX files to PDF using docx2pdf (requires MS Word).",
//         tags: ["file-conversion", "word", "pdf", "docx"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `from docx2pdf import convert
// import os


// def word_to_pdf(input_path: str, output_path: str | None = None) -> None:
//     """
//     Convert a Word file (.docx) to PDF.
//     - input_path: path to .docx file or folder
//     - output_path: optional output path (file or folder)
//     """
//     convert(input_path, output_path)


// if __name__ == "__main__":
//     # Convert single file
//     word_to_pdf("input.docx", "output.pdf")
    
//     # Convert all .docx files in a folder
//     word_to_pdf("input_folder/", "output_folder/")`,
//           requirements: `pip install docx2pdf`,
//         },
//         usage: "Install MS Word, then run: python word_to_pdf.py to convert DOCX to PDF.",
//       },

//       {
//         id: "pdf-to-word",
//         title: "PDF to Word Converter",
//         description: "Convert PDF files to Word DOCX using pdf2docx.",
//         tags: ["file-conversion", "pdf", "word", "docx"],
//         language: "Python",
//         difficulty: "Easy",
//         code: {
//           main: `from pdf2docx import Converter
// import os


// def pdf_to_word(pdf_path: str, docx_path: str) -> None:
//     """
//     Convert a PDF file to DOCX.
//     """
//     cv = Converter(pdf_path)
//     cv.convert(docx_path, start=0, end=None)
//     cv.close()


// def batch_pdf_to_word(pdf_folder: str, output_folder: str) -> None:
//     """
//     Convert all PDFs in a folder to DOCX.
//     """
//     os.makedirs(output_folder, exist_ok=True)
//     for filename in os.listdir(pdf_folder):
//         if filename.lower().endswith(".pdf"):
//             pdf_file = os.path.join(pdf_folder, filename)
//             docx_file = os.path.join(output_folder, filename.replace(".pdf", ".docx"))
//             pdf_to_word(pdf_file, docx_file)
//             print(f"Converted {pdf_file} → {docx_file}")


// if __name__ == "__main__":
//     # Convert single PDF
//     pdf_to_word("input.pdf", "output.docx")
    
//     # Convert all PDFs in a folder
//     batch_pdf_to_word("pdfs/", "docs/")`,
//           requirements: `pip install pdf2docx`,
//         },
//         usage: "Use to convert scanned or text-based PDFs into editable Word files.",
//       },

//       {
//         id: "csv-to-pdf-table-advanced",
//         title: "CSV to PDF Table Generator (Advanced)",
//         description:
//           "Convert CSV files to formatted PDF tables with customizable page size, row count, font size, and styling.",
//         tags: ["file-conversion", "csv", "pdf", "table", "reportlab", "data-visualization", "customizable"],
//         language: "Python",
//         difficulty: "Medium",
//         code: {
//           main: `import pandas as pd
// from reportlab.lib.pagesizes import landscape, A1, letter
// from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, PageBreak
// from reportlab.lib import colors
// from reportlab.lib.units import inch


// # ===== CONFIGURATION =====
// CSV_FILE = "input.csv"
// PDF_FILE = "output.pdf"
// PAGE_SIZE = landscape(A1)  # landscape(letter) for smaller, landscape(A1) for huge
// ROWS_PER_PAGE = 30  # Adjust based on row_height
// ROW_HEIGHT = 18  # Pixels per row
// FONT_SIZE = 6  # Table font size
// HEADER_COLOR = colors.grey
// HEADER_TEXT_COLOR = colors.whitesmoke
// BODY_COLOR = colors.beige
// BORDER_WIDTH = 0.25
// # =======================


// df = pd.read_csv(CSV_FILE)
// doc = SimpleDocTemplate(PDF_FILE, pagesize=PAGE_SIZE)
// elements = []

// page_width, page_height = PAGE_SIZE

// # Dynamic column widths
// num_cols = len(df.columns)
// col_width = (page_width - 1.5 * inch) / num_cols
// col_widths = [col_width] * num_cols

// # Chunk DataFrame into multiple pages
// for start in range(0, len(df), ROWS_PER_PAGE):
//     chunk = df.iloc[start:start + ROWS_PER_PAGE]
//     data = [chunk.columns.tolist()] + chunk.values.tolist()

//     table = Table(data, colWidths=col_widths, repeatRows=1)
//     table.setStyle(TableStyle([
//         ('BACKGROUND', (0,0), (-1,0), HEADER_COLOR),
//         ('TEXTCOLOR', (0,0), (-1,0), HEADER_TEXT_COLOR),
//         ('ALIGN', (0,0), (-1,-1), 'CENTER'),
//         ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
//         ('FONTSIZE', (0,0), (-1,-1), FONT_SIZE),
//         ('BOTTOMPADDING', (0,0), (-1,0), 6),
//         ('BACKGROUND', (0,1), (-1,-1), BODY_COLOR),
//         ('GRID', (0,0), (-1,-1), BORDER_WIDTH, colors.black)
//     ]))

//     elements.append(table)
//     elements.append(PageBreak())


// def add_page_number(canvas, doc):
//     page_num = canvas.getPageNumber()
//     text = f"Page {page_num}"
//     canvas.drawRightString(page_width - inch, 0.5 * inch, text)


// doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)
// print(f"✅ PDF saved as {PDF_FILE}")`,
//           requirements: `pip install pandas reportlab`,
//         },
//         usage:
//           "Customizable CSV to PDF converter. Adjust PAGE_SIZE, ROWS_PER_PAGE, font size, and colors in the configuration section.",
//       },
//     ],
//   },
// ];
