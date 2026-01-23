#  Intelligence Agent

A modular, AI-powered utility orchestration package that routes natural language queries to the right tools using LLMs (OpenAI GPT-4o-mini). This plug-and-play framework powers intelligent decisions, dynamic context management, and multi-format response generation for building next-gen AI-native systems.

---

##  Features

###  Agent Orchestration Engine
- Smart natural language routing using LLMs  
- Auto-selects tools and generates responses intelligently  
- Maintains context with user chat history  

###  Dynamic Tool Registry
- Plug-and-play tool registration  
- Input schema validation for tools  
- Dynamic imports and modular microservice support  

###  Context Management
- Persistent JSON-based chat history  
- Customizable roles and metadata injection  
- Configurable memory window for context  

###  LLM Response Formatting
- Outputs in JSON, YAML, Python, plain-text  
- Built-in formatting + fallback handling  
- Supports raw or system-prompt guided outputs  

###  AI Parameter Enhancement
- Enhances user input dynamically before tool execution  
- LLM-powered parameter filling  
- Highly configurable prompt + temperature tuning  


###  Dynamic Import + Registry Helpers
- Decorators to register tools via strings  
- Simple interface for dynamic plugin systems  

---

##  Installation

### Prerequisites

- Python 3.8+
- At least one LLM provider key:
  - OpenAI API Key (`OPENAI_API_KEY`)
  - Google Gemini API Key (`GEMINI_API_KEY`)
  - Groq API Key (`GROQ_API_KEY`)
- Internet connection (for real-time LLM calls)


###  Install Locally from Wheel

```bash 

pip install path/to/logging_utils-<version>-py3-none-any.whl 
 
Example: 
 
pip install ai_utility_orchestrator-0.1.0-py3-none-any.whl 
 

``` 

##  Quickstart

### 1. Run the Agent

```python
from agent_builder import agent_executor
from utils.toolkit import ConfigUtils

config = ConfigUtils.load_config("config/config_default.json")
prompt = "Search for Python programming tutorials"

response = agent_executor(prompt, config=config)
print(response["final_response"])
```

### 2. Load Config with Overrides

```python
overrides = {
    "llm": {"temperature": 0.3},
    "enable_parameter_enhancement": True
}

config = ConfigUtils.load_config("config/config_default.json", overrides=overrides)
print(config["llm"]["temperature"])
```


### 3. Tool Registration

```python
from agent_registry import ToolRegistry, Tool

def greet_tool(params):
    return f"Hello, {params.get('name', 'User')}!"

registry = ToolRegistry()
tool = Tool(name="greeter", description="Greets the user", execute_func=greet_tool, schema={})
registry.register_tool(tool)

result = registry.get_tool("greeter").execute({"name": "Akshay"})
print(result)
```

### 4. LLM Response Formatter

```python
from utils.response_formatter import format_response

prompt = "Give me three benefits of using AI in healthcare."
formatted = format_response(prompt, formatter="json", model_name="gpt-4o-mini", return_meta=True)

print("Parsed Output:", formatted["parsed_response"])
```

---

##  Agent Orchestration Overview

The core orchestrator is `agent_executor`. It:
1. Loads available tools  
2. Prompts LLM to infer intent  
3. Executes the chosen tool  
4. Enhances or parses output  
5. Saves chat history in JSON  

---

##  API Reference

---

| Function/Class               | Description                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| `agent_executor`            | Main agent engine that routes user input to the correct tool using LLMs.    |
| `Tool`                      | Represents a callable tool with metadata and optional input schema.         |
| `ToolRegistry`              | Handles tool registration, listing, and dynamic retrieval.                  |
| `register_tool`             | Registers a tool into the live registry during runtime.                     |
| `ContextManager`            | Manages user chat history and maintains message context.                    |
| `get_recent_messages`       | Returns a limited number of recent messages for a specific user.            |
| `format_response`           | Sends prompts to LLM and formats the output into JSON, text, etc.           |


---

##  Usage Examples

###  Basic Query Routing

```python
from agent_builder import agent_executor
from utils.toolkit import ConfigUtils

config = ConfigUtils.load_config()
result = agent_executor("Find recent news on AI", config=config)
print(result["final_response"])
```

###  Enhanced Tool Parameters

```python
config["enable_parameter_enhancement"] = True
response = agent_executor("Search for advanced ML topics", config=config)
print(response["final_response"])
```

###  Chat History & Context

```python
from utils.context_manager import ContextManager

manager = ContextManager()
history = manager.get_recent_messages(user_id="default_user", limit=3)
for msg in history:
    print(msg)
```

###  Load Custom Config

```python
overrides = {
    "context_limit": 2,
    "llm": {
        "model": "gpt-4o-mini",
        "temperature": 0.4
    }
}

config = ConfigUtils.load_config(overrides=overrides)
print(config)
```

###  Dynamic Tool Import

```python
from utils.toolkit import DynamicImportUtils

execute_func = DynamicImportUtils.load_object("core.tools.search_execute")
params = {"query": "Latest LLM trends"}
print(execute_func(params))
```

---

##  Running Tests

```bash
Your test.py file
```

---

##  Modules

| Module                   | Description                                       |
|--------------------------|---------------------------------------------------|
| `agent_builder.py`       | Core orchestration logic                          |
| `agent_registry.py`      | Tool management and registration                  |
| `context_manager.py`     | Chat context handler with memory control          |
| `response_formatter.py`  | LLM output formatting for JSON/YAML/text          |
| `toolkit.py`             | Config and utility loader                         |
---

##  License

This project is licensed under the **64 Squares License**.

---