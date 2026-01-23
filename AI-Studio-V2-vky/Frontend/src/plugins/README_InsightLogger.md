# InsightLogger

A comprehensive, production-ready logging utility that provides universal logging capabilities supporting file, console, and multiple databases (MongoDB, Snowflake). Designed for modern Python applications with built-in support for web frameworks, async operations, and automatic logging features.

---

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

---

## Installation

### Method 1: Install from Wheel File
```bash
pip install path/to/logging_utils-<version>-py3-none-any.whl
```

Example:
```bash
pip install ./dist/logging_utils-0.1.0-py3-none-any.whl
```

### Install Dependencies
```bash
pip install pymongo snowflake-connector-python
```

---

## Basic Usage

### Simple Setup
```python
from logging_utils import UniversalLogger

logger = UniversalLogger(name="MyApp")
logger.info("Hello from logging_utils!")
```

### Advanced Configuration
```python
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
```

### Log Levels
- `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL`

### Async-Safe Logging
- Use `async_safe=True` for FastAPI/Flask apps

---

## Log Structure

### Default Fields
Includes timestamp, level, name, message, filename, line number, thread, and process

### Custom Fields
```python
logger.info("User logged in", extra={"user_id": 123, "action": "login"})
```

### Exception Logging
```python
try:
    1 / 0
except ZeroDivisionError:
    logger.exception("Math failed")
```

---

## Database Logging

### MongoDB
```python
logger.add_db_handler(
    "mongodb",
    {"uri": "mongodb://localhost:27017", "database": "myapp"},
    "logs"
)
```

### Snowflake
```python
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
```

---

## Automatic Logging Features

### Auto-Log Uncaught Exceptions
```python
from logging_utils import auto_log_exceptions
auto_log_exceptions(logger)
```

### Auto-Log Functions
```python
from logging_utils import auto_log_function

@auto_log_function(logger)
def my_function(x, y):
    return x + y
```

### Capture Standard Logs
```python
from logging_utils import auto_log_standard
auto_log_standard(logger)
```

---

## Web Framework Integration

### Flask
```python
from flask import Flask
from logging_utils import auto_log_flask

app = Flask(__name__)
auto_log_flask(app, logger)
```

### FastAPI
```python
from fastapi import FastAPI
from logging_utils import auto_log_fastapi

app = FastAPI()
auto_log_fastapi(app, logger)
```

---

## Real-World Examples

### Simple Application
```python
from logging_utils import UniversalLogger, auto_log_function

logger = UniversalLogger(name="MyApp", log_file="app.log")

@auto_log_function(logger)
def process_data(data):
    logger.info("Processing data", extra={"data_size": len(data)})
    return data.upper()

result = process_data("hello world")
```

### With MongoDB
```python
logger = UniversalLogger(name="WebApp")

logger.add_db_handler(
    "mongodb",
    {"uri": "mongodb://localhost:27017", "database": "myapp"},
    "logs"
)

logger.info("Application started")
```

---

## Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   chmod 755 /path/to/log/directory
   ```

---

## Requirements

- Python 3.7+
- pymongo
- snowflake-connector-python

---

## Dependencies

- **pymongo** – MongoDB driver  
- **snowflake-connector-python** – Snowflake connector  

---

## Testing

```bash
python tests/your_test_file.py
```

---

## Modules

| Module | Description |
|--------|-------------|
| `UniversalLogger` | Main logger class with file, console, and DB support |
| `auto_log_exceptions` | Auto-capture and log uncaught exceptions |
| `auto_log_function` | Decorator to log function input/output/errors |
| `auto_log_standard` | Captures standard library logging and reroutes it |
| `auto_log_flask` | Automatically logs Flask requests |
| `auto_log_fastapi` | Automatically logs FastAPI requests |

---

## API Reference

| Function/Class | Signature | Description |
|----------------|-----------|-------------|
| `UniversalLogger` | `UniversalLogger(name, ...)` | Initializes a logger with options for file, console, DB |
| `add_db_handler` | `add_db_handler(db_type, config, collection_or_table)` | Adds a DB handler for MongoDB/Snowflake |
| `auto_log_function` | `@auto_log_function(logger)` | Logs entry/exit/errors of wrapped functions |
| `auto_log_exceptions` | `auto_log_exceptions(logger)` | Logs all uncaught exceptions globally |
| `auto_log_standard` | `auto_log_standard(logger)` | Redirects Python std logging to UniversalLogger |
| `auto_log_flask` | `auto_log_flask(app, logger)` | Logs all Flask routes automatically |
| `auto_log_fastapi` | `auto_log_fastapi(app, logger)` | Logs all FastAPI routes automatically |

---

## License

This project is licensed under the 64 Squares LLC License.

---