
# Confique

A lightweight configuration utility that provides reliable environment and YAML-based configuration loading. 
Designed for modern Python applications, supporting clean separation of runtime vs. static configuration with fallback handling.

---

## ✨ Features

- ✅ Load from `.env` and `.yml` configuration files
- ✅ Fallback defaults for missing keys
- ✅ Simple `.get()` interface for key-based access
- ✅ Safe and readable error handling
- ✅ Class-based loaders for modularity
- ✅ Supports different environments (dev, prod, test)

---

## 📥 Installation

### Method 1: Install from Wheel File

```bash
pip install path/to/config_loader-<version>-py3-none-any.whl
```

Example:

```bash
pip install ./dist/config_loader-0.1.0-py3-none-any.whl
```

### Install Dependencies

```bash
pip install python-dotenv pyyaml
```

---

## ⚙️ Basic Usage

### Create a `.env` file

```env
APP_ENV=production
DEBUG=true
DB_HOST=prod-db
DB_PORT=5432
API_KEY=prod-secret-key
```

### Create a `config.yml` file

```yaml
APP_NAME: MyApp
VERSION: 1.0
ENABLE_LOGGING: true
```

### Load Config in Python

```python
from config_loader import EnvConfigLoader, YamlConfigLoader

env_loader = EnvConfigLoader(".env")
print(env_loader.get("APP_ENV"))   # production
print(env_loader.get("DB_PORT"))   # 5432

yaml_loader = YamlConfigLoader("config.yml")
print(yaml_loader.get("APP_NAME"))  # MyApp
print(yaml_loader.get("VERSION"))   # 1.0
```

---

## 🔍 API Reference

| Class / Function         | Description                                              | Parameters                                                  | Returns                       |
|--------------------------|----------------------------------------------------------|-------------------------------------------------------------|-------------------------------|
| `EnvConfigLoader(path)`  | Loads environment config from a `.env` file              | `path`: str – Path to `.env` file (default: `.env`)         | Instance of EnvConfigLoader   |
| `get(key, default=None)` | Get value from `.env` config                             | `key`: str, `default`: any (optional)                       | Value from `.env` or default  |
| `YamlConfigLoader(path)` | Loads structured config from a `.yml` file               | `path`: str – Path to `.yml` file (default: `config.yml`)   | Instance of YamlConfigLoader  |
| `get(key, default=None)` | Get value from `.yml` config                             | `key`: str, `default`: any (optional)                       | Value from `.yml` or default  |

---

## 🧪 Testing

```bash
python tests/you_test_file.py
```

---


To run tests and verify real-world use cases:
```
python tests/your_test_file.py
```

## 📄 License

This project is licensed under the 64 Squares LLC License.
