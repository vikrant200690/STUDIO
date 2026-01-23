
#  DocFlow
A modular, plug-and-play suite for reading, cleaning, embedding, indexing, and managing documents across local and cloud environments. Supports full RAG pipelines with vector search, OCR, file handling, and multi-cloud storage support.

---

##  Features

 **File Handling**

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


   - **Text Cleaning**

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


   - **Embedding**

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


   - **Vector Store Integration**

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



##   Installation

### Prerequisites
- Python ≥ 3.8
- pip ≥ 20.0
- virtualenv (recommended)

### Install from Wheel

```bash
pip install path/to/docflow-<version>-py3-none-any.whl

# Example:
pip install ./dist/docflow-0.1.0-py3-none-any.whl
```

---

##   Quickstart


### Manual Processing Workflow

```python
from file_utils import UniversalFileHandler
from text_cleaning import TextCleaner
from embedding_utils import Embedder
from vector_utils import VectorStore

text = UniversalFileHandler().read_file("docs/sample.pdf")
cleaned = TextCleaner().clean_single(text)
embedding = Embedder(provider="openai").embed_texts([cleaned])
VectorStore("chroma")._index_file("docs/sample.pdf")
```

---

##  API Reference

| Function/Class               | Description                                                                 |
|------------------------------|-----------------------------------------------------------------------------|
| `UniversalFileHandler`       |Unified interface for reading, writing, validating, uploading, and           |
|                              |downloading files across local, AWS S3, GCP, Azure, MongoDB,and Snowflake.   |
|                              |Supports various formats including `.txt`, `.pdf`, `.docx`, `.csv`, `.json`, |
|                              |`.yaml`.                                                                     |
| `TextCleaner`                |Flexible and configurable text preprocessor that supports removing HTML tags |
|                              |,emojis, accents, stopwords, and punctuation. Can clean individual           |
|                              |strings or batches with language detection and custom cleaning pipelines.    |
| `Embedder`                   |Generates vector embeddings from text, images, or multimodal data using      |
|                              |OpenAI, Cohere, or Gemini. Supports batch embedding with retry logic and     |
|                              |dynamic provider switching.                                                  |
| `VectorStore`                |Abstract handler for connecting to vector databases (Chroma, PostgreSQL,     |
|                              |MongoDB, Snowflake, etc.), and indexing/querying document embeddings using   |
|                              |semantic similarity.                                                         |    
|------------------------------------------------------------------------------------------------------------|


##  Usage Examples

### Upload Files (Local or Cloud)

```python
from file_utils import UniversalFileHandler

# Local
handler = UniversalFileHandler()
path = handler.upload_file("example.txt")

# AWS S3
s3_path = handler.upload_file("file.pdf", storage_type="cloud", destination="bucket-name", cloud_provider="aws", connection_details={
    "aws_access_key_id": "...",
    "aws_secret_access_key": "...",
    "region": "us-west-1"
})

# GCP
handler.upload_file("data.csv", storage_type="cloud", destination="my-gcp-bucket", cloud_provider="gcp", connection_details={
    "service_account_json": "gcp_key.json"
})

# Azure
handler.upload_file("invoice.docx", storage_type="cloud", destination="my-container", cloud_provider="azure", connection_details={
    "connection_string": "..."
})
# MongoDB
handler.upload_file(
    "document.pdf",
    storage_type="cloud",
    destination="my_gridfs_bucket",
    cloud_provider="mongodb",
    connection_details={
        "uri": "mongodb://localhost:27017",
        "db": "your_db_name",
        "collection": "fs" 
    })

 # Snowflake
handler.upload_file(
    "contract.docx",
    storage_type="cloud",
    destination="@my_stage/documents",
    cloud_provider="snowflake",
    connection_details={
        "user": "your_username",
        "password": "your_password",
        "account": "your_account.region.snowflakecomputing.com",
        "warehouse": "your_warehouse",
        "database": "your_database",
        "schema": "your_schema",
        "role": "your_role",  # optional
        "table": "your_target_table" 
    }
)

  ```

### Validate and Read Files

```python
handler.validate_file("large.zip", allowed_exts=[".zip"], max_size_mb=10)
data = handler.read_file("sample.pdf") 
```

### Batch Processing

```
python
results = handler.read_files(["a.txt", "b.csv"])
for r in results:
    print(r["file"], r["status"])
```

### Write and Delete Files

```python
handler.write_file("Hello!", "greeting", ext="txt")
handler.remove_file("old_file.txt")
```

---

##  Text Cleaning Example

```python
from text_cleaning import TextCleaner

config = {
    "language": "english",
    "steps_to_apply": ["remove_html_tags", "remove_emojis", "remove_accents", "to_lower",
                       "normalize_whitespace", "remove_punctuation", "remove_special_chars", "remove_stopwords"]
}

texts = ["<p>Hello World!</p>", "C'est déjà l'été."]
cleaner = TextCleaner(config=config)
results = cleaner.clean_texts(texts)
```

---

##  Embedding Generation

```python
from embedding_utils import Embedder

embedder = Embedder(provider="openai")
embeddings = embedder.embed_texts(["This is a test", "Another sentence"])
```

---

##  Vector Store Operations

```python
from vector_utils import AbstractVectorStore, index_path

# Index one document
store = AbstractVectorStore(database="chroma", namespace="docs")
store.index_document("doc1", "This is a sample document")

# Index entire folder
index_path("data/folder", database="mongo_atlas", namespace="bulk_docs")

# Search Top-K
results = store.query("What is vector search?", top_k=3)
```

##  Running Tests

```bash
python tests/your_test_file.py
```

---

##  License

This project is licensed under the **64 Squares License**.
