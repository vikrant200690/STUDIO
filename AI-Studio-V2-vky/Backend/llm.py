# import os
# from groq import Groq
# from dotenv import load_dotenv
# import traceback

# # Load .env
# load_dotenv()

# # Get GROQ API key
# api_key = os.getenv("GROQ_API_KEY")

# if not api_key:
#     print("❌ GROQ_API_KEY not found in .env. Please add it:")
#     print("GROQ_API_KEY=your_actual_api_key_here")
#     exit()

# # Initialize GROQ client
# client = Groq(api_key=api_key)

# def test_groq_chat():
#     try:
#         # Free model
#         model_name = "llama-3.1-8b-instant"

#         # Chat message
#         messages = [{"role": "user", "content": "Hello, Groq! Are you working?"}]

#         # Create chat completion
#         response = client.chat.completions.create(
#             model=model_name,
#             messages=messages
#         )

#         # Safe access to content
#         msg = getattr(response.choices[0].message, "content", None)
#         if msg is None:
#             print("⚠ Could not read message content from response")
#         else:
#             print("✅ GROQ Working:\n")
#             print(msg)

#     except Exception as e:
#         print("❌ Error occurred:")
#         traceback.print_exc()

# if __name__ == "__main__":
#     test_groq_chat()


# import os
# from dotenv import load_dotenv
# from langchain_openai import ChatOpenAI
# from langchain_core.messages import HumanMessage

# # Load variables from .env
# load_dotenv()

# # Access API key (optional to print)
# api_key = os.getenv("OPENAI_API_KEY")

# # Initialize model
# llm = ChatOpenAI(
#     model="gpt-3.5-mini",   # Change model if needed
#     temperature=0.2,
#     api_key=api_key        # Optional since .env auto-loads
# )

# # Send a prompt
# response = llm.invoke([
#     HumanMessage(content="Write a short motivational quote.")
# ])

# print(response.content)


# import zipfile

# whl_file = r"C:\studio ai\AI-Studio-V2\Backend\plugins_repo\voice_assistant-0.1.0-py3-none-any.whl"
# with zipfile.ZipFile(whl_file, 'r') as zip_ref:
#     # List all files in the wheel
#     zip_ref.printdir()
    
#     # Optionally, extract all contents to a folder
#     zip_ref.extractall(r"C:\Users\vikra\OneDrive\Desktop\pluggins\voice_assistant-0.1.0-py3-none-any")



