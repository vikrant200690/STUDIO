import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Book,
  Settings,
  MessageCircle,
  Zap,
  Shield,
  Code,
  Lightbulb,
  Search,
  Package,
  BookOpenIcon,
  Brain,
  GitBranch,
  Eye,
  Link,
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  Star,
  AlertCircle,
  Mic,
  Link2,
  BookIcon
} from "lucide-react";

const Knowledge = () => {
  
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  // const [activeSection, setActiveSection] = useState("getting-started");
    const [activeSection, setActiveSection] = useState("case-studies");
  const [activePlugin, setActivePlugin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState({});
  const [plugins, setPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleExpanded = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Plugin configuration with icons, colors, and README content
  const pluginConfig = {
    "intelligence-agent": {
      name: "Intelligence Agent",
      icon: <Brain className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600",
      status: "active",
      readmeContent: `# Intelligence Agent

A modular, AI-powered utility orchestration package that routes natural language queries to the right tools using LLMs (OpenAI GPT-4o-mini). This plug-and-play framework powers intelligent decisions, dynamic context management, and multi-format response generation for building next-gen AI-native systems.

## Features

### Agent Orchestration Engine
- Smart natural language routing using LLMs  
- Auto-selects tools and generates responses intelligently  
- Maintains context with user chat history  

### Dynamic Tool Registry
- Plug-and-play tool registration  
- Input schema validation for tools  
- Dynamic imports and modular microservice support  

### Context Management
- Persistent JSON-based chat history  
- Customizable roles and metadata injection  
- Configurable memory window for context  

### LLM Response Formatting
- Outputs in JSON, YAML, Python, plain-text  
- Built-in formatting + fallback handling  
- Supports raw or system-prompt guided outputs  

### AI Parameter Enhancement
- Enhances user input dynamically before tool execution  
- LLM-powered parameter filling  
- Highly configurable prompt + temperature tuning  

### Dynamic Import + Registry Helpers
- Decorators to register tools via strings  
- Simple interface for dynamic plugin systems  

## Installation

### Prerequisites

- Python 3.8+
- At least one LLM provider key:
  - OpenAI API Key (\`OPENAI_API_KEY\`)
  - Google Gemini API Key (\`GEMINI_API_KEY\`)
  - Groq API Key (\`GROQ_API_KEY\`)
- Internet connection (for real-time LLM calls)

### Install Locally from Wheel

\`\`\`bash
pip install path/to/logging_utils-<version>-py3-none-any.whl 

Example: 

pip install ai_utility_orchestrator-0.1.0-py3-none-any.whl 
\`\`\`

## Quickstart

### 1. Run the Agent

\`\`\`python
from agent_builder import agent_executor
from utils.toolkit import ConfigUtils

config = ConfigUtils.load_config("config/config_default.json")
prompt = "Search for Python programming tutorials"

response = agent_executor(prompt, config=config)
print(response["final_response"])
\`\`\`

### 2. Load Config with Overrides

\`\`\`python
overrides = {
    "llm": {"temperature": 0.3},
    "enable_parameter_enhancement": True
}

config = ConfigUtils.load_config("config/config_default.json", overrides=overrides)
print(config["llm"]["temperature"])
\`\`\`

### 3. Tool Registration

\`\`\`python
from agent_registry import ToolRegistry, Tool

def greet_tool(params):
    return f"Hello, {params.get('name', 'User')}!"

registry = ToolRegistry()
tool = Tool(name="greeter", description="Greets the user", execute_func=greet_tool, schema={})
registry.register_tool(tool)

result = registry.get_tool("greeter").execute({"name": "Akshay"})
print(result)
\`\`\`

### 4. LLM Response Formatter

\`\`\`python
from utils.response_formatter import format_response

prompt = "Give me three benefits of using AI in healthcare."
formatted = format_response(prompt, formatter="json", model_name="gpt-4o-mini", return_meta=True)

print("Parsed Output:", formatted["parsed_response"])
\`\`\`

## Agent Orchestration Overview

The core orchestrator is \`agent_executor\`. It:
1. Loads available tools  
2. Prompts LLM to infer intent  
3. Executes the chosen tool  
4. Enhances or parses output  
5. Saves chat history in JSON  

## API Reference

| Function/Class               | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| \`agent_executor\`            | Main agent engine that routes user input to the correct tool using LLMs.    |
| \`Tool\`                      | Represents a callable tool with metadata and optional input schema.         |
| \`ToolRegistry\`              | Handles tool registration, listing, and dynamic retrieval.                  |
| \`register_tool\`             | Registers a tool into the live registry during runtime.                     |
| \`ContextManager\`            | Manages user chat history and maintains message context.                    |
| \`get_recent_messages\`       | Returns a limited number of recent messages for a specific user.            |
| \`format_response\`           | Sends prompts to LLM and formats the output into JSON, text, etc.           |

## License

This project is licensed under the **64 Squares License**.`,
    },
    confique: {
      name: "Confique",
      icon: <Settings className="w-5 h-5" />,
      color: "from-yellow-500 to-orange-600",
      status: "active",
      readmeContent: `# Confique

A lightweight configuration utility that provides reliable environment and YAML-based configuration loading. 
Designed for modern Python applications, supporting clean separation of runtime vs. static configuration with fallback handling.

## ✨ Features

- ✅ Load from \`.env\` and \`.yml\` configuration files
- ✅ Fallback defaults for missing keys
- ✅ Simple \`.get()\` interface for key-based access
- ✅ Safe and readable error handling
- ✅ Class-based loaders for modularity
- ✅ Supports different environments (dev, prod, test)

## 📥 Installation

### Method 1: Install from Wheel File

\`\`\`bash
pip install path/to/config_loader-<version>-py3-none-any.whl
\`\`\`

Example:

\`\`\`bash
pip install ./dist/config_loader-0.1.0-py3-none-any.whl
\`\`\`

### Install Dependencies

\`\`\`bash
pip install python-dotenv pyyaml
\`\`\`

## ⚙️ Basic Usage

### Create a \`.env\` file

\`\`\`env
APP_ENV=production
DEBUG=true
DB_HOST=prod-db
DB_PORT=5432
API_KEY=prod-secret-key
\`\`\`

### Create a \`config.yml\` file

\`\`\`yaml
APP_NAME: MyApp
VERSION: 1.0
ENABLE_LOGGING: true
\`\`\`

### Load Config in Python

\`\`\`python
from config_loader import EnvConfigLoader, YamlConfigLoader

env_loader = EnvConfigLoader(".env")
print(env_loader.get("APP_ENV"))   # production
print(env_loader.get("DB_PORT"))   # 5432

yaml_loader = YamlConfigLoader("config.yml")
print(yaml_loader.get("APP_NAME"))  # MyApp
print(yaml_loader.get("VERSION"))   # 1.0
\`\`\`

## 🔍 API Reference

| Class / Function         | Description                                              | Parameters                                                  | Returns                       |
|--------------------------|----------------------------------------------------------|-------------------------------------------------------------|-------------------------------|
| \`EnvConfigLoader(path)\`  | Loads environment config from a \`.env\` file              | \`path\`: str – Path to \`.env\` file (default: \`.env\`)         | Instance of EnvConfigLoader   |
| \`get(key, default=None)\` | Get value from \`.env\` config                             | \`key\`: str, \`default\`: any (optional)                       | Value from \`.env\` or default  |
| \`YamlConfigLoader(path)\` | Loads structured config from a \`.yml\` file               | \`path\`: str – Path to \`.yml\` file (default: \`config.yml\`)   | Instance of YamlConfigLoader  |
| \`get(key, default=None)\` | Get value from \`.yml\` config                             | \`key\`: str, \`default\`: any (optional)                       | Value from \`.yml\` or default  |

## 🧪 Testing

\`\`\`bash
python tests/you_test_file.py
\`\`\`

## 📄 License

This project is licensed under the 64 Squares LLC License.`,
    },
    docflow: {
      name: "DocFlow",
      icon: <FileText className="w-5 h-5" />,
      color: "from-purple-500 to-pink-600",
      status: "active",
      readmeContent: `# DocFlow

A modular, plug-and-play suite for reading, cleaning, embedding, indexing, and managing documents across local and cloud environments. Supports full RAG pipelines with vector search, OCR, file handling, and multi-cloud storage support.

## Features

### File Handling

- Source: file_handler.py
  The UniversalFileHandler class provides a universal API to manage files across local and cloud storage systems.

- Local File Upload/Download:
  Uploads files to a default or specified directory with versioning
  → upload_file, upload_files, _upload_to_local
  Reads different formats using MIME type detection
  (e.g., .txt, .json, .csv, .docx, .pdf)
  → read_file, read_files
  Writes content in .txt, .json, or .csv format
  → write_file, write_files

- Cloud File Handling:
  Supports upload/download to:
  AWS S3
  → _upload_to_aws, _download_from_aws
  Google Cloud Storage
  → _upload_to_gcp, _download_from_gcp
  Azure Blob Storage
  → _upload_to_azure, _download_from_azure
  Uses cloud-specific credentials with validation via CloudConnectionValidator
  snowflake
  → _upload_to_snowflake, _download_from_snowflake
  Google Cloud Storage
  → _upload_to_mongodb, _download_from_mongodb

- Validation:
  Validate file type, size, and presence
  → validate_file, validate_files

### Text Cleaning

- Source: cleaner.py
  The TextCleaner class implements a configurable and extensible cleaning pipeline for raw text.

- Configurable Steps (applied in order):
  remove_html_tags — Strips HTML using BeautifulSoup
  remove_emojis — Removes Unicode emojis using regex
  remove_accents — Normalizes accented characters using unicodedata
  to_lower — Converts to lowercase
  normalize_whitespace — Normalizes whitespace
  remove_punctuation — Removes punctuation using string.punctuation
  remove_special_chars — Removes non-alphanumeric characters
  remove_stopwords — Removes stopwords using NLTK

- Language Detection:
  Uses langdetect.detect()→ detect_language(text)

- Batch Processing:
  Clean a list of texts → clean_texts(texts)
  Clean a single text → clean_single(text)

### Embedding

- Source: embeddings.py
  The Embedder class provides dynamic embedding generation based on the provider and modality.

- Supported Providers:
  OpenAI — Text only
  Cohere — Text, Image, Multimodal
  Gemini — Text only

- Text Embedding:
  Batching with retry logic→ embed_texts(), _embed_texts_openai, _embed_texts_cohere, _embed_texts_gemini

- Image Embedding:
  Available for Cohere only→ embed_images(), _embed_images_cohere()

- Multimodal Embedding (Text + Image):
  Available for Cohere only→ embed_multimodal(), _embed_multimodal_cohere()

- Token-based batching using tiktoken→ _token_based_batches()

- Environment-based loading via .env keys→ from_env(), config_loader()

### Vector Store Integration

- Source: vector.py
  Supports storing and querying embeddings from various vector databases.

- Databases Supported:
  Chroma → via chromadb.Client()
  PostgreSQL → via psycopg2
  MongoDB (Atlas or Local) → via pymongo
  Snowflake → via snowflake.connector
  Neo4j → via GraphDatabase

- Functions:
  generate_embedding(text) — Generates embeddings using OpenAI
  _index_file(file_path) — Reads and indexes file content
  _index() — Writes documents and embeddings to the database
  _delete_file(file_id) — Deletes documents from the database
  query(query_text, top_k=3) — Returns top matching documents (MongoDB implemented)

## Installation

### Prerequisites
- Python ≥ 3.8
- pip ≥ 20.0
- virtualenv (recommended)

### Install from Wheel

\`\`\`bash
pip install path/to/docflow-<version>-py3-none-any.whl

# Example:
pip install ./dist/docflow-0.1.0-py3-none-any.whl
\`\`\`

## Quickstart

### Manual Processing Workflow

\`\`\`python
from file_utils import UniversalFileHandler
from text_cleaning import TextCleaner
from embedding_utils import Embedder
from vector_utils import VectorStore

text = UniversalFileHandler().read_file("docs/sample.pdf")
cleaned = TextCleaner().clean_single(text)
embedding = Embedder(provider="openai").embed_texts([cleaned])
VectorStore("chroma")._index_file("docs/sample.pdf")
\`\`\`

## API Reference

| Function/Class               | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| \`UniversalFileHandler\`       |Unified interface for reading, writing, validating, uploading, and           |
|                              |downloading files across local, AWS S3, GCP, Azure, MongoDB,and Snowflake.   |
|                              |Supports various formats including \`.txt\`, \`.pdf\`, \`.docx\`, \`.csv\`, \`.json\`, |
|                              |\`.yaml\`.                                                                     |
| \`TextCleaner\`                |Flexible and configurable text preprocessor that supports removing HTML tags |
|                              |,emojis, accents, stopwords, and punctuation. Can clean individual           |
|                              |strings or batches with language detection and custom cleaning pipelines.    |
| \`Embedder\`                   |Generates vector embeddings from text, images, or multimodal data using      |
|                              |OpenAI, Cohere, or Gemini. Supports batch embedding with retry logic and     |
|                              |dynamic provider switching.                                                  |
| \`VectorStore\`                |Abstract handler for connecting to vector databases (Chroma, PostgreSQL,     |
|                              |MongoDB, Snowflake, etc.), and indexing/querying document embeddings using   |
|                              |semantic similarity.                                                         |    

## License

This project is licensed under the **64 Squares License**.`,
    },
    "insight-logger": {
      name: "InsightLogger",
      icon: <FileText className="w-5 h-5" />,
      color: "from-indigo-500 to-blue-600",
      status: "active",
      readmeContent: `# InsightLogger

A comprehensive, production-ready logging utility that provides universal logging capabilities supporting file, console, and multiple databases (MongoDB, Snowflake). Designed for modern Python applications with built-in support for web frameworks, async operations, and automatic logging features.

## Features

- **Multi-Output Logging**: File, console, and database logging simultaneously  
- **Database Support**: MongoDB and Snowflake integration out of the box  
- **JSON & Plain Text Formats**: Structured logging with customizable formats  
- **Async-Safe Logging**: Queue-based logging for high-performance applications  
- **Automatic Logging**: Decorators and middleware for automatic function/request logging  
- **Web Framework Integration**: Built-in support for Flask and FastAPI  
- **Exception Handling**: Global exception logging and automatic traceback capture  
- **Log Rotation**: Configurable file rotation with size limits  
- **Custom Fields**: Add contextual information to any log entry  
- **Standard Library Integration**: Capture logs from third-party libraries  

## Installation

### Method 1: Install from Wheel File
\`\`\`bash
pip install path/to/logging_utils-<version>-py3-none-any.whl
\`\`\`

Example:
\`\`\`bash
pip install ./dist/logging_utils-0.1.0-py3-none-any.whl
\`\`\`

### Install Dependencies
\`\`\`bash
pip install pymongo snowflake-connector-python
\`\`\`

## Basic Usage

### Simple Setup
\`\`\`python
from logging_utils import UniversalLogger

logger = UniversalLogger(name="MyApp")
logger.info("Hello from logging_utils!")
\`\`\`

### Advanced Configuration
\`\`\`python
from logging_utils import UniversalLogger

logger = UniversalLogger(
    name="ProductionApp",
    log_file="production.log",
    log_level="DEBUG",
    max_file_size=10 * 1024 * 1024,
    backup_count=5,
    log_format="json",
    console_output=True,
    async_safe=False
)
\`\`\`

### Log Levels
- \`DEBUG\`, \`INFO\`, \`WARNING\`, \`ERROR\`, \`CRITICAL\`

### Async-Safe Logging
- Use \`async_safe=True\` for FastAPI/Flask apps

## Log Structure

### Default Fields
Includes timestamp, level, name, message, filename, line number, thread, and process

### Custom Fields
\`\`\`python
logger.info("User logged in", extra={"user_id": 123, "action": "login"})
\`\`\`

### Exception Logging
\`\`\`python
try:
    1 / 0
except ZeroDivisionError:
    logger.exception("Math failed")
\`\`\`

## Database Logging

### MongoDB
\`\`\`python
logger.add_db_handler(
    "mongodb",
    {"uri": "mongodb://localhost:27017", "database": "myapp"},
    "logs"
)
\`\`\`

### Snowflake
\`\`\`python
logger.add_db_handler(
    "snowflake",
    {
        "user": "username",
        "password": "password",
        "account": "account",
        "warehouse": "warehouse",
        "database": "database",
        "schema": "schema",
        "role": "role"
    },
    "logs"
)
\`\`\`

## Automatic Logging Features

### Auto-Log Uncaught Exceptions
\`\`\`python
from logging_utils import auto_log_exceptions
auto_log_exceptions(logger)
\`\`\`

### Auto-Log Functions
\`\`\`python
from logging_utils import auto_log_function

@auto_log_function(logger)
def my_function(x, y):
    return x + y
\`\`\`

### Capture Standard Logs
\`\`\`python
from logging_utils import auto_log_standard
auto_log_standard(logger)
\`\`\`

## Web Framework Integration

### Flask
\`\`\`python
from flask import Flask
from logging_utils import auto_log_flask

app = Flask(__name__)
auto_log_flask(app, logger)
\`\`\`

### FastAPI
\`\`\`python
from fastapi import FastAPI
from logging_utils import auto_log_fastapi

app = FastAPI()
auto_log_fastapi(app, logger)
\`\`\`

## Real-World Examples

### Simple Application
\`\`\`python
from logging_utils import UniversalLogger, auto_log_function

logger = UniversalLogger(name="MyApp", log_file="app.log")

@auto_log_function(logger)
def process_data(data):
    logger.info("Processing data", extra={"data_size": len(data)})
    return data.upper()

result = process_data("hello world")
\`\`\`

### With MongoDB
\`\`\`python
logger = UniversalLogger(name="WebApp")

logger.add_db_handler(
    "mongodb",
    {"uri": "mongodb://localhost:27017", "database": "myapp"},
    "logs"
)

logger.info("Application started")
\`\`\`

## License

This project is licensed under the **64 Squares License**.`,
    },
    "voice-assistant": {
      name: "Voice Assistant API",
      icon: <Mic className="w-5 h-5" />,
      color: "from-green-500 to-teal-600",
      status: "active",
      readmeContent: `# 🎙️ Voice Assistant API

This package can be used for real-time AI conversation using voice.
Users send an audio file → get a natural response in text and audio format.

## ✅ What This API Does

* Accepts a voice/audio file (\`.mp3\`, \`.wav\`, etc.)
* Transcribes speech to text using Deepgram
* Sends the transcript to a friendly AI model (OpenAI GPT or Groq LLaMA)
* Converts the AI response back to audio using Deepgram TTS
* Returns:
  * the transcript,
  * the AI's response (text),
  * and a base64 MP3 audio response

## ⚙️ How to Use This API
You can start using this package in 3 simple steps:

1. Make sure the backend is deployed
Ask your developer, team, or hosting service for the backend URL
(e.g. \`https://your-backend.com/transcribe\`)
You don't need to clone or install anything yourself.

2. Send a \`POST\` request to \`/transcribe\` with your audio file
Here's a quick example using \`curl\`:

\`\`\`bash
curl -X POST https://your-backend.com/transcribe \\
  -H "accept: application/json" \\
  -H "Content-Type: multipart/form-data" \\
  -F "audio=@your_audio_file.mp3"
\`\`\`

You can also use:
* Postman
* JavaScript \`fetch\`
* Python \`requests\`

## 🧑‍💻 Example: Send Audio (JavaScript)
\`\`\`js
const formData = new FormData();
formData.append("audio", yourAudioBlobOrFile, "audio.wav");

const response = await fetch("https://your-backend.com/transcribe", {
  method: "POST",
  body: formData
});

const data = await response.json();
console.log("Transcript:", data.transcript);
console.log("AI Response:", data.response);
\`\`\`

## 🔊 Example: Play AI Response Audio (JavaScript)
\`\`\`js
if (data.audio) {
  const audioData = atob(data.audio); // decode base64
  const audioArray = new Uint8Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    audioArray[i] = audioData.charCodeAt(i);
  }
  const audioBlob = new Blob([audioArray], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(audioBlob);
  const audioPlayer = new Audio(audioUrl);
  audioPlayer.play();
}
\`\`\`

3. Get the response
You'll receive a JSON response like this:

\`\`\`json
{
  "transcript": "Hey, how are you?",
  "response": "Hey! I'm doing great, thanks for asking. How about you?",
  "audio": "BASE64_ENCODED_MP3_STRING",
  "audio_format": "mp3"
}
\`\`\`

You can:
* Read the response text
* Play the audio by decoding the base64 string in the frontend

## 🔧 How to Configure It (for developers)
To configure this backend, set up a \`.env\` file with the following:
\`\`\`env
Required API key for Deepgram (for both transcription and speech)
DEEPGRAM_API_KEY=your_deepgram_key

Provide the API key for the selected LLM
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key

Choose one LLM provider
Options: "groq", "openai", "mistral"
LLM_PROVIDER=groq 
\`\`\`
Whichever model is selected in \`LLM_PROVIDER\`, the corresponding key must be available.

## 🧠 Supported LLM Models
- For openai, it uses gpt-4o
- For groq, it uses meta-llama/llama-4-scout-17b-16e-instruct
- Mistral option is placeholder for future use (not yet implemented)

## 📦 Features
* No installation or cloning required for end users
* Accepts audio files up to 10MB
* Friendly AI responses in casual tone
* Base64 audio output for easy embedding in web/mobile apps

## 💡 Use Cases
* Voice-powered chatbots
* Personal AI assistants
* Voice user interfaces for apps
* Conversational AI demos

## License
This project is licensed under the **64 Squares License**.`,
    },"api-bridge": {
      name: "APIBridge",
      icon: <Link2 className="w-5 h-5" />,
      color: "from-red-500 to-orange-600",
      status: "active",
      readmeContent: `# 🧠 APIBridge 

A modular, production-ready FastAPI application to bridge your frontend with LLMs or backend logic. Built for intelligent applications requiring dynamic queries, contextual memory, analytics, and document management.

## ✨ Features

- ✅ Organized routers for LLM, documents, and analytics  
- ✅ Pluggable LLM handler via constructor  
- ✅ Static file serving for frontend UIs (React, HTML, etc.)  
- ✅ Robust validation and error handling  
- ✅ Fully CORS-compliant  
- ✅ Compatible with any backend model or engine (OpenAI, Claude, custom logic)  
- ✅ Health checks, analytics, and status endpoints  
- ✅ Swagger UI auto-generated  

## 📥 Installation

### Prerequisites
- Python ≥ 3.8

### Option 1: Standard Installation

\`\`\`bash
pip install fastapi uvicorn pydantic
\`\`\`

### Option 2: Install from Wheel

\`\`\`bash
pip install ./dist/frontend_api-0.1.2-py3-none-any.whl
\`\`\`

## 🧪 Quickstart Example

Create a file called \`test_frontend.py\`:

\`\`\`python
from frontend_api.frontend.frontend_api import FrontendUtilsAPI

def dummy_llm_handler(query, metadata):
    return f"Answer to: {query}"

def dummy_info_handler(context, metadata):
    return f"Stored info: {context}"

api = FrontendUtilsAPI(dummy_llm_handler, dummy_info_handler)
app = api.get_app()
\`\`\`

Run the API:

\`\`\`bash
uvicorn test_frontend:app --reload
\`\`\`

Swagger UI will be available at: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 📘 API Reference

| Method | Endpoint              | Description                            | Request Body / Query Params                                                                 | Response Example |
|--------|-----------------------|----------------------------------------|---------------------------------------------------------------------------------------------|------------------|
| POST   | \`/ask\`                | Ask a question and receive a response  | \`{ "query": "What is FastAPI?", "metadata": { "user": "test" } }\`                          | \`{ "response": "Answer to: What is FastAPI?" }\` |
| POST   | \`/add-info\`           | Add contextual information             | \`{ "context": "FastAPI is a Python web framework.", "metadata": { "source": "Wikipedia" } }\` | \`{ "response": "Stored info: FastAPI is a Python web framework." }\` |
| GET    | \`/status\`             | Check if the API is running            | _None_                                                                                      | \`{ "status": "API is running" }\` |
| PUT    | \`/update-info\`        | Replace stored context                 | \`{ "context": "Updated definition of FastAPI.", "metadata": {} }\`                           | *Depends on handler* |
| DELETE | \`/delete-info\`        | Delete specific info by query string   | Query: \`?query=fastapi\`                                                                     | \`{ "message": "Deleted info related to query: fastapi" }\` |
| PATCH  | \`/patch-info\`         | Partially update stored context        | \`{ "context": "Additional details added to context.", "metadata": {} }\`                     | *Depends on handler* |
| GET    | \`/llm/models\`         | List available LLM model names         | _None_                                                                                      | \`["gpt-4", "claude-3", "llama-3"]\` |

## 📄 Document Management API

### 📤 Upload a Document

\`\`\`python
import requests

with open("resume.pdf", "rb") as file:
    response = requests.post(
        "http://localhost:8000/documents/upload",
        files={"file": ("resume.pdf", file, "application/pdf")}
    )

print(response.json())
\`\`\`

## 📈 Analytics Endpoints

### \`GET /analytics/stats\`

Returns usage statistics:

\`\`\`json
{
  "total_queries": 1250,
  "avg_response_time": 0.85,
  "popular_topics": ["AI", "FastAPI", "Python"]
}
\`\`\`

### \`GET /analytics/health\`

Returns API health and uptime:

\`\`\`json
{
  "status": "healthy",
  "uptime": "24h"
}
\`\`\`

## 🧪 Running Tests

Make sure your tests are in the \`tests/\` folder. Run:

\`\`\`bash
pytest tests/test_frontend.py
python tests/your_test_file.py
\`\`\`

## 📄 License

This project is licensed under the **64 squares License**.`
    }
  };

  // Parse README content into sections
  const parseReadmeContent = (content, pluginId) => {
    const lines = content.split("\n");
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith("#")) {
        // Save previous section
        if (currentSection) {
          sections.push({
            title: currentSection,
            content: currentContent.join("\n").trim(),
          });
        }

        // Start new section
        currentSection = line.replace(/^#+\s*/, "");
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    // Add last section
    if (currentSection) {
      sections.push({
        title: currentSection,
        content: currentContent.join("\n").trim(),
      });
    }

    // If no sections found, create a single overview section
    if (sections.length === 0) {
      sections.push({
        title: "Overview",
        content: content,
      });
    }

    return sections;
  };

  // Extract description from README content
  const extractDescription = (content) => {
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.trim() && !line.startsWith("#") && !line.startsWith("```")) {
        return line.trim();
      }
    }
    return "Plugin documentation";
  };

  // Extract version from README content
  const extractVersion = (content) => {
    const versionMatch = content.match(/version[:\s]+(\d+\.\d+\.\d+)/i);
    return versionMatch ? versionMatch[1] : "1.0.0";
  };

  // Load plugins from config
  useEffect(() => {
    const loadPlugins = async () => {
      setLoading(true);
      setError(null);

      try {
        const loadedPlugins = [];

        for (const [pluginId, config] of Object.entries(pluginConfig)) {
          try {
            const sections = parseReadmeContent(config.readmeContent, pluginId);
            const description = extractDescription(config.readmeContent);
            const version = extractVersion(config.readmeContent);

            loadedPlugins.push({
              id: pluginId,
              name: config.name,
              description: description,
              icon: config.icon,
              version: version,
              status: config.status,
              color: config.color,
              sections: sections,
            });
          } catch (pluginError) {
            console.warn(`Error processing plugin ${pluginId}:`, pluginError);
            loadedPlugins.push({
              id: pluginId,
              name: config.name,
              description: `${config.name} plugin documentation`,
              icon: config.icon,
              version: "1.0.0",
              status: config.status,
              color: config.color,
              sections: [
                {
                  title: "Overview",
                  content: `# ${config.name}\n\nDocumentation for ${config.name} plugin.`,
                },
              ],
            });
          }
        }

        setPlugins(loadedPlugins);
      } catch (err) {
        setError("Failed to load plugin documentation");
        console.error("Error loading plugins:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlugins();
  }, []);

  const aiStudioSections = [

    {
      id: "case-studies",
      title: "Case Studies",
      icon: <BookOpenIcon className="w-4 h-4" />,
      content: {
        // title: "Case Studies",
        description:
          "Explore real-world implementations of our projects to understand how intelligent AI solutions are designed, built, and deployed.",
        items: [
          {
            title: "AUM automation for a leading Real estate player",
            content: `
**Client Background** 🏢

A leading global real assets investment management firm operating across private and public real estate and infrastructure, managing over **$100 billion in assets under management (AUM)**.


### 🚧 Business Challenge

The firm reports **Assets Under Management (AUM)** as a key performance metric within its Investment Management segment, spanning multiple real estate assets and investment funds.

At the time of engagement, AUM calculations were:
- Manually performed by asset and fund managers
- Based on varied data sources and inconsistent business logic
- Highly dependent on Excel-based processes

This resulted in:
- **Data inconsistencies and inaccuracies**
- **Operational inefficiencies**
- **Increased compliance and audit risk**


### 💡 Solution Overview

We designed and implemented an **automated, scalable, and auditable AUM reporting platform** built on **Snowflake**, eliminating manual calculations and Excel dependencies.

Key solution components included:
- Consolidation of disparate data sources into a **single source of truth**
- Standardization of AUM calculation logic across funds and assets
- Automated, end-to-end data pipelines with built-in quality checks
- Drill-down performance reporting through interactive dashboards

To further enhance efficiency, **Generative AI capabilities within Snowflake** were leveraged to automate complex AUM calculations while ensuring transparency and auditability.


### 📈 What Was Achieved

The solution delivered a **high-performance, enterprise-grade data platform** enabling reliable AUM reporting and insights at scale:

- **Data source identification and seamless integration**
- **Common AUM logic development across all funds**
- **Optimized data modeling and Snowflake performance tuning**
- **Automated AUM reporting and insights dashboards**
- **Robust data governance, quality controls, and audit framework**


### 🛠️ Technical Stack

- **Data Warehouse:** Snowflake  
- **Data Modeling:** dbt (data build tool)  
- **Data Ingestion & Processing:** Python, SnapLogic  
- **Backend:** Python, Snowflake, dbt  
- **Frontend:** Streamlit / Flask  
- **Visualization & Reporting:** Power BI  

🎯 **Impact:** Enabled accurate, consistent, and audit-ready AUM reporting while significantly reducing manual effort, operational risk, and time-to-insight.
  `,
          },
          {
  title: "Netezza Migration for a Leading Healthcare Payor",
  content: `
**Client Background** 🏥

A leading nonprofit health insurer committed to delivering affordable, high-quality healthcare services to individuals and employers across the state.


### 🚧 Business Challenge

IBM Netezza reaching **end-of-support** introduced significant risks to the organization’s enterprise data platform:

- Rising maintenance costs with limited vendor support for troubleshooting and upgrades
- Increased risk to platform availability, reliability, and business continuity
- Inability to leverage modern data, analytics, and AI capabilities
- Dependency on legacy **SSIS-based ETL processes**, requiring migration to a modern ETL toolset

The organization needed a seamless transition to a future-ready data platform while ensuring minimal disruption to downstream systems.


### 💡 Solution Overview

We executed a **phased and secure migration from IBM Netezza to Snowflake**, ensuring continuity, performance, and scalability.

Key solution components included:
- Provisioning a **new Snowflake environment** with enterprise-grade configurations
- Building a **metadata-driven replication framework** to support both initial data loads and incremental (delta) replication
- Replicating **security roles from Netezza to Snowflake** to minimize downstream code changes
- Enabling downstream systems with updated **connection strings and connectors**
- Providing remediation support to dependent applications as requested by business stakeholders
- Assisting in the **solution design and adoption of Matillion** as the new ETL processing platform


### 📈 What Was Achieved

The migration delivered a **modern, scalable, and resilient data platform** with improved operational efficiency:

- **Snowflake environment setup** with pre-configured roles and warehouses
- **Smart replication framework** enabling reliable data movement using metadata-driven initial and incremental loads
- **Security alignment** between legacy and modern platforms to ensure seamless downstream integration
- Reduced operational risk and improved platform availability


### 🛠️ Technical Stack

- **Data Warehouse:** Snowflake  
- **Data Replication:** Python, Airflow  
- **Backend:** Python, Snowflake, Linux Server  
- **ETL Tools:** Matillion, Fivetran  

🎯 **Impact:** Enabled a smooth transition from a legacy data platform to Snowflake, reducing operational risk, improving scalability, and laying the foundation for advanced analytics and AI-driven initiatives.
  `,
},
{
  title: "Virtual Pain Clinic (VPC) – AI-Powered Patient Intake System",
  content: `
**Client Background** 🩺

A veteran anesthesiologist and pain specialist with over **30 years of clinical experience**, founder of a leading U.S. pain clinic, and now an online advisor specializing in chronic pain management.


### 🚧 Business Challenge

Traditional patient intake processes posed significant limitations:

- Patient intake required **45+ minutes**, largely driven by repetitive and location-based questioning
- Manual workflows increased administrative burden and delayed clinical decision-making
- Scaling patient volume without compromising **clinical accuracy and safety** was difficult
- A strict requirement for **HIPAA-compliant AI implementation** with built-in safety guardrails


### 💡 Solution Overview

We built an **intelligent, agentic patient intake system** leveraging **LangGraph** to orchestrate multiple AI agents working in parallel.

Key solution capabilities included:

- **3D Pain Mapping:** A proprietary, rotatable body diagram enabling intuitive pain location input by patients
- **Dynamic Question Routing:** AI agents intelligently eliminate irrelevant questions based on detected pain patterns
- **Parallel Safety Monitoring:** A dedicated red-flag detection agent continuously evaluates patient inputs for clinical risks
- **ICD-10 Coding Assistance:** LLM-powered diagnostic code suggestions with clinical justification
- **Structured Clinical Output:** Automated, physician-ready intake summaries designed for rapid clinical review


### 📈 What Was Achieved

The solution delivered measurable improvements in efficiency, safety, and scalability:

- **85% reduction** in location-related intake questions through 3D pain mapping
- A robust **clinical safety framework** with parallel red-flag detection
- **Structured data outputs** fully compatible with existing EMR systems
- **HIPAA-compliant architecture** with complete data control through in-house development
- Intelligent branching into **syndrome-specific follow-up questions**


### 🛠️ Technical Stack

- **Agent Orchestration:** LangGraph  
- **Vector Database:** Chroma DB  
- **LLM Integration:** HIPAA-compliant AI for summarization and ICD-10 coding assistance  
- **Frontend & Backend:** React, FastAPI  
- **Infrastructure:** HIPAA-compliant cloud environment  

🎯 **Impact:** Transformed patient intake into a fast, safe, and intelligent experience—reducing administrative overhead, improving clinical readiness, and enabling scalable chronic pain care delivery.
  `,
},
{
  title: "AI Solution for Ontologics – IP Analytics Platform",
  content: `
**Client Background** 🌐

A global data analytics company focused on integrating **intellectual property (IP) insights** with real-world technology and market data to support informed, strategic decision-making.


### 🚧 Business Challenge

Users struggled to efficiently access relevant insights within the existing IP analytics platform:

- Data was distributed across multiple modules, requiring extensive manual navigation
- Platform complexity reduced overall usability and slowed insight discovery
- Non-technical users faced significant barriers to self-service data access
- Inefficient data discovery negatively impacted productivity and analytical workflows


### 💡 Solution Overview

We implemented an **AI-powered enterprise data assistant** leveraging **Snowflake Cortex AI** to enable intuitive, natural-language interaction with the platform’s data.

Key solution capabilities included:
- **Plain-language querying** using context-aware natural language processing (NLP)
- **Automated SQL generation** to translate complex business questions into executable queries
- **Semantic model mapping** to ensure accuracy, consistency, and trusted results
- **Direct querying of Snowflake**, eliminating manual reporting and Excel dependencies
- Real-time insights into **patents, innovation trends, inventors, and platform metadata**
- Consolidation of analytics into a **single source of truth** supporting governance and auditability


### 📈 What Was Achieved

The solution significantly enhanced usability, accessibility, and analytical efficiency:

- Built an **AI-powered chatbot** for factual and analytical data interaction
- Enabled delivery of **platform information, patent insights, and visualizations**
- Empowered users with **natural language querying** and automated SQL generation
- Implemented semantic data mapping for consistent, reliable insights
- Successfully demonstrated, delivered, and deployed **Use Case 1** to production


### 🛠️ Technical Stack

- **Data Warehouse:** Snowflake  
- **AI & NLP:** Snowflake Cortex AI, Semantic Model  
- **Backend:** Python, FastAPI, SQLAlchemy  
- **Frontend:** React (TypeScript)  
- **Visualization:** Recharts  

🎯 **Impact:** Enabled self-service analytics for both technical and non-technical users, accelerating insight discovery while improving data governance and trust across the IP analytics platform.
  `,
},
{
  title: "Station Casinos – AI-Powered HR Policy Chatbot",
  content: `
**Client Background** 🎰

Station Casinos operates numerous casino and entertainment properties with a diverse workforce that includes **full-time, part-time, and contract employees**. Each employee group follows different HR policies and information guidelines, creating a need for fast, accurate, and role-specific policy access.


### 🚧 Business Challenge

Accessing HR policies manually from lengthy documents introduced several operational challenges:

- Employees spent excessive time searching through **long PDF-based HR policy documents**
- HR teams faced an increased workload answering **repetitive policy-related queries**
- Delayed responses negatively impacted **employee satisfaction and productivity**
- No centralized, easily accessible system for on-demand HR policy information


### 💡 Solution Overview

We implemented an **AI-powered HR policy assistant** using the **Contextual AI platform**, designed to deliver accurate, role-specific answers instantly.

Key solution components included:
- Leveraging **Contextual AI’s datastore** to securely store and retrieve large HR policy documents
- Designing two specialized AI agents:
  - **Persona Collection Agent** to identify employee type (full-time, part-time, contractor)
  - **HR Policy Agent** to generate answers tailored to the identified persona
- Defining **system prompts, rules, and guardrails** to ensure policy accuracy and compliance
- Enabling employees to retrieve **personalized HR policy information** without manual searching
- Streamlining HR workflows by reducing repetitive inquiries and manual intervention


### 📈 What Was Achieved

The proof-of-concept successfully demonstrated the value of AI-driven HR support:

- Delivered an **AI assistant for role-specific HR policy queries**
- Automated responses, significantly reducing HR team workload
- Provided **personalized, policy-compliant answers** based on employee type
- Improved response times and employee experience
- Established a scalable foundation for **enterprise-wide HR self-service support**


### 🛠️ Technical Stack

- **Frontend:** React JS  
- **Backend:** FastAPI  
- **LLM Frameworks:** LangChain, Contextual AI  

🎯 **Impact:** Enabled fast, personalized access to HR policies, reduced administrative overhead for HR teams, and improved overall employee satisfaction across Station Casinos’ workforce.
  `,
},
{
  title: "Life Sciences AI – Secure Role-Based Data Access Platform",
  content: `
**Client Background** 🧬

The client manages large volumes of **clinical and research datasets** and required a secure, role-based access system. Research staff needed access only to research data, while clinical users required access to both clinical and research information, all within a compliant and governed environment.


### 🚧 Business Challenge

Managing and serving responses across sensitive datasets introduced critical challenges:

- Ensuring **role-based access control (RBAC)** for clinical and research users
- Preventing unauthorized access to sensitive clinical information
- Maintaining **data security, privacy, and regulatory compliance**
- Delivering accurate responses to users based on their assigned roles
- Managing large datasets without compromising accessibility or governance


### 💡 Solution Overview

We implemented a **Contextual AI–powered data access and retrieval platform** to securely manage and organize clinical and research data at scale.

Key solution components included:
- **Metadata tagging** to classify files as clinical or research, enabling secure, role-based access
- A **metadata-driven file structure** for fast, compliant data retrieval
- Contextual rules and guardrails to enforce authorized data visibility and prevent misuse
- Centralized automation to improve data accessibility, security, and operational efficiency
- Integration of a **LangChain agent** leveraging an out-of-the-box LLM for optimized responses
- A **web search integration** to supplement AI responses with relevant external information when needed


### 📈 What Was Achieved

The solution delivered measurable improvements across security, usability, and workflow efficiency:

- Built a **Contextual AI system** enabling secure, role-based data access
- Automated **metadata-based classification** for clinical and research files
- Enabled fast, compliant, and **role-specific information retrieval**
- Improved data accessibility, security posture, and cross-team collaboration
- Delivered responses from **dual sources**: AI agent and web search results


### 🛠️ Technical Stack

- **Frontend:** React JS  
- **Backend:** FastAPI  
- **LLM Frameworks:** LangChain, Contextual AI  

🎯 **Impact:** Enabled secure, compliant, and intelligent access to sensitive life sciences data while improving productivity and maintaining strict regulatory controls.
  `,
},
{
  title: "Matterhorn Translation – AI-Powered Multilingual Legal Document Translation",
  content: `
**Client Background** ⚖️

The client required a **multilingual translation system for legal documents**, with a strong emphasis on preserving original document structure and formatting across languages. The solution also needed to support **time sheet–based entries** and structured document workflows.


### 🚧 Business Challenge

Traditional legal translation workflows introduced multiple inefficiencies:

- Manual translation processes were **time-consuming and costly**
- Legal document formatting was often lost during translation
- Limited automation increased the risk of **human errors**
- Inefficient workflows slowed document turnaround times


### 💡 Solution Overview

We built an **AI-powered legal document translation platform** capable of handling **DOCX and PDF** formats with high accuracy and formatting fidelity.

Key solution capabilities included:
- Automated multilingual translation optimized for legal terminology
- **Preservation of document formatting**, layout, and structure across languages
- Seamless integration of a **FastAPI backend** with a **React.js frontend**
- Deployment on **AWS EC2** to ensure scalability, reliability, and performance
- End-to-end automated workflow reducing manual intervention


### 📈 What Was Achieved

The solution delivered significant efficiency and quality improvements:

- Successfully deployed **Version 1** of the translation platform with multi-language support
- **Drastically reduced translation turnaround time** while maintaining precision
- Preserved legal document formatting with **high fidelity**
- Delivered a reliable, automated, and scalable translation workflow


### 🛠️ Technical Stack

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** FastAPI (Python)  
- **Database & Hosting:** AWS, EC2  

🎯 **Impact:** Enabled fast, accurate, and format-preserving legal document translation, significantly reducing cost and effort while improving delivery speed and reliability.
  `,
}
        ],
      },
      
    },
        {
      id: "documentation",
      title: "Documentation",
      icon: <BookIcon className="w-4 h-4" />,
    },
  ];

  const filteredSections = aiStudioSections.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const filteredPlugins = plugins.filter(
    (plugin) =>
      plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSection = aiStudioSections.find((s) => s.id === activeSection);
  const currentPlugin = plugins.find((p) => p.id === activePlugin);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-500/20";
      case "beta":
        return "text-yellow-400 bg-yellow-500/20";
      case "inactive":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const handlePluginClick = (pluginId) => {
    setActivePlugin(pluginId);
    setActiveSection(null);
  };

  const handleBackToStudio = () => {
    setActivePlugin(null);
    setActiveSection("getting-started");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white/60">Loading plugin documentation...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-900 to-slate-950 text-white">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full animate-float"
            style={{
              left: Math.random() * 100 + "%",
              animationDelay: Math.random() * 8 + "s",
              animationDuration: 8 + Math.random() * 4 + "s",
            }}
          />
        ))}
      </div>

      <div className="h-screen w-full relative z-10 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {activePlugin && (
                  <button
                    onClick={handleBackToStudio}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-3 flex items-center gap-3">
                    {activePlugin ? (
                      <>
                        {currentPlugin?.icon}
                        {currentPlugin?.name}
                      </>
                    ) : (
                      <>
                        <Book className="w-8 h-8 text-blue-400" />
                        Knowledge Base
                      </>
                    )}
                  </h1>
                  <p className="text-white/60 text-lg">
                    {activePlugin
                      ? currentPlugin?.description
                      : "Get to Know about Our Case Studies"}
                  </p>
                </div>
              </div>

              {/* Search */}
            </div>

            {/* Navigation */}
            {!activePlugin ? (
              <div className="flex flex-wrap gap-2 mb-8">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                        : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {section.icon}
                    {section.title}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${currentPlugin?.color} bg-opacity-20`}
                  >
                    {currentPlugin?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold">
                        Version {currentPlugin?.version}
                      </span>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          currentPlugin?.status
                        )}`}
                      >
                        {currentPlugin?.status}
                      </div>
                    </div>
                    <p className="text-white/70 text-sm">
                      {currentPlugin?.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
            <div>
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
                  <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    {/* {currentSection.icon} */}
                    <BookOpenIcon className="w-8 h-8" />
                    {currentSection.content.title}
                  </h2>
                  <p className="text-white/70 text-lg">
                    {currentSection.content.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {currentSection.content.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          toggleExpanded(`${currentSection.id}-${index}`)
                        }
                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all duration-200"
                      >
                        <h3 className="text-xl font-semibold text-left">
                          {item.title}
                        </h3>
                        {expandedItems[`${currentSection.id}-${index}`] ? (
                          <ChevronDown className="w-5 h-5 text-blue-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-white/60" />
                        )}
                      </button>

                      {expandedItems[`${currentSection.id}-${index}`] && (
                        <div className="px-6 pb-6">
                          <div className="prose prose-invert prose-blue max-w-none">
                            <div
                              className="text-white/80 leading-relaxed whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: item.content
                                  .replace(
                                    /\*\*(.*?)\*\*/g,
                                    '<strong class="text-white font-semibold">$1</strong>'
                                  )
                                  .replace(
                                    /\*(.*?)\*/g,
                                    '<em class="text-blue-300">$1</em>'
                                  )
                                  .replace(
                                    /###\s(.*)/g,
                                    '<h3 class="text-xl font-semibold text-white mt-6 mb-3">$1</h3>'
                                  )
                                  .replace(
                                    /##\s(.*)/g,
                                    '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>'
                                  )
                                  .replace(
                                    /```([\s\S]*?)```/g,
                                    '<pre class="bg-black/30 border border-white/20 rounded-lg p-4 mt-4 mb-4 overflow-x-auto"><code class="text-green-300 text-sm">$1</code></pre>'
                                  )
                                  .replace(
                                    /`(.*?)`/g,
                                    '<code class="bg-white/10 px-2 py-1 rounded text-green-300 text-sm">$1</code>'
                                  )
                                  .replace(
                                    /^- (.*)/gm,
                                    '<li class="ml-4 mb-2">$1</li>'
                                  )
                                  .replace(
                                    /(\d+\.\s.*)/g,
                                    '<div class="ml-4 mb-2">$1</div>'
                                  ),
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
     <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-2xl">
        <h3 className="text-lg font-semibold mb-2">Want More Case Studies?</h3>
        <p className="text-white/70 mb-4">
          Explore additional real-world AI projects, best practices, and technical insights.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-500/30 transition-all duration-200">
            📄 Download Case Studies PDF
          </button>
          <button className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-500/30 transition-all duration-200">
            💡 View More Projects
          </button>
          <button className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30 transition-all duration-200">
            ✉ Contact Us
          </button>
        </div>
      </div>
  </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 8s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Knowledge;
