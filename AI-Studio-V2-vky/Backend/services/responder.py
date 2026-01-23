import os
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from config import Settings
from dotenv import load_dotenv, find_dotenv
 
 
# Configure logging
logger = logging.getLogger(__name__)
 
 
settings = Settings()
 
 
load_dotenv(find_dotenv())
 
 
print(f"🔑 OpenAI Key: {'✅' if os.getenv('OPENAI_API_KEY') else '❌'}")
print(f"🔑 Google Key: {'✅' if os.getenv('GOOGLE_API_KEY') else '❌'}")
print(f"🔑 Groq Key: {'✅' if os.getenv('GROQ_API_KEY') else '❌'}")
 
 
 
class Responsellm:
    def __init__(self):
        # Import here to avoid circular imports
        from services.embedding_service import EmbeddingService
        self.embedding_service = EmbeddingService()
        # Thread pool for synchronous Groq calls
        self.executor = ThreadPoolExecutor(max_workers=3)
 
 
    async def generate_response(self, transcript: str, system_prompt: str = None, model: str = None, temperature: float = None, top_p: float = None, document_mode: bool = False) -> dict:
        """
        Enhanced response generation with document context, reranking, and out-of-scope detection
        """
        try:
            prompt = system_prompt or settings.LLM_SYSTEM_PROMPT
           
            print(f"Generating response for: {transcript}")
            print(f"Document mode: {document_mode}")
           
            # Step 1: Classify user intent using LLM - FIXED: Now async
            intent = await self._classify_user_intent(transcript, model=model)
            print(f"🎯 User intent classified as: {intent}")
           
            # Step 2: Handle different intents appropriately
            if intent == "GREETING":
                return await self._handle_greeting(transcript, model=model)
           
            elif intent == "CONVERSATIONAL":
                return await self._handle_conversational_response(transcript, document_mode, model=model)
 
 
            elif intent == "QUESTION":
                # Handle as a question - check document relevance if in document mode
                if not document_mode:
                    # LLM Only Mode - Use existing logic
                    print("🤖 LLM Only Mode - Using general knowledge for response")
                    return await self._generate_llm_only_response(transcript, system_prompt, model, temperature, top_p)
 
 
                # Document Mode - Use existing logic
                print("📄 Document Mode - Using document context for response")
                return await self._handle_document_question(transcript, system_prompt, model, temperature, top_p)
 
 
            # Fallback - treat as question
            print("⚠️ Intent classification unclear, treating as question")
            if not document_mode:
                return await self._generate_llm_only_response(transcript, system_prompt, model, temperature, top_p)
            else:
                return await self._handle_document_question(transcript, system_prompt, model, temperature, top_p)
 
 
        except Exception as e:
            logger.error(f"Response generation error: {e}")
            return {"response": None, "error": str(e)}
 
 
    async def _handle_greeting(self, transcript: str, model: str = None) -> dict:
        """Handle greeting responses consistently for both document and LLM modes"""
        print("👋 Greeting detected - providing friendly response")
        greeting_response = await self._generate_greeting_response(transcript, model=model)
        return {
            "response": greeting_response,
            "mode": "greeting",
            "context_used": False,
            "greeting_detected": True
        }
 
 
 
    def _classify_query_type(self, query: str) -> str:
        """Classify query type for content-specific prompting"""
        query_lower = query.lower()
 
 
        # Table-related keywords
        table_keywords = ["table", "data", "results",
                          "values", "numbers", "statistics", "chart", "graph"]
        if any(keyword in query_lower for keyword in table_keywords):
            return "table"
 
 
        # Figure/image-related keywords
        figure_keywords = ["figure", "image", "diagram",
                           "visualization", "picture", "photo"]
        if any(keyword in query_lower for keyword in figure_keywords):
            return "figure"
 
 
        # Mixed content
        if any(keyword in query_lower for keyword in ["document", "content", "information"]):
            return "mixed"
 
 
        return "general"
 
 
    def _is_greeting(self, query: str) -> bool:
        """Detect if the query is a greeting or casual conversation"""
        query_lower = query.lower().strip()
 
 
        # Common greetings - only standalone or at start
        greetings = [
            "hi", "hello", "hey", "good morning", "good afternoon", "good evening", "good night",
            "good day", "morning", "afternoon", "evening", "night", "sup", "what's up",
            "how are you", "how's it going", "how do you do", "pleasure to meet you",
            "nice to meet you", "greetings", "salutations", "hi there",
            "hello there", "hey there", "good to see you", "nice to see you"
        ]
 
 
        # Check for exact matches
        if query_lower in greetings:
            print(f"✅ Exact greeting match: '{query_lower}'")
            return True
 
 
        # Check for greetings with punctuation or slight variations
        for greeting in greetings:
            # Only match if the greeting is at the start or is a complete word
            if (query_lower.startswith(greeting) or
                f" {greeting} " in f" {query_lower} " or
                    query_lower.endswith(f" {greeting}")):
                print(
                    f"✅ Greeting pattern match: '{greeting}' in '{query_lower}'")
                return True
 
 
        # Check for greeting patterns with regex - only at the start
        import re
        greeting_patterns = [
            r"^hi\s*\w*",  # hi, hi there, hi friend
            r"^hello\s*\w*",  # hello, hello there
            r"^hey\s*\w*",  # hey, hey there
            r"^good\s+(morning|afternoon|evening|night|day)",
            r"^(morning|afternoon|evening|night|day)$",
            r"^how\s+are\s+you",
            r"^how\s+is\s+it\s+going",
            r"^what\s+is\s+up",
            r"^what's\s+up",
            r"^sup\s*\w*",
        ]
 
 
        # Additional check: if query contains common non-greeting words, it's likely not a greeting
        non_greeting_words = ["document", "file", "upload", "question", "answer", "what", "how", "when",
                              "where", "why", "can", "will", "should", "from", "about", "content", "data", "information"]
        if any(word in query_lower for word in non_greeting_words):
            print(f"🚫 Contains non-greeting words, likely not a greeting")
            return False
 
 
        for pattern in greeting_patterns:
            if re.match(pattern, query_lower):
                print(
                    f"✅ Regex greeting match: '{pattern}' for '{query_lower}'")
                return True
 
 
        print(f"❌ No greeting detected for: '{query_lower}'")
        return False
 
 
    async def _invoke_llm(self, llm, messages):
        """Universal LLM invoker that handles both sync (Groq) and async (OpenAI/Gemini)"""
        # Check if Groq needs sync invoke
        if isinstance(llm, tuple) and llm[0] == "groq":
            # Run synchronous Groq in thread pool to avoid blocking event loop
            print("🔄 Running Groq in thread pool (sync mode)")
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                self.executor,
                lambda: llm[1].invoke(messages)
            )
            return response.content
        else:
            # Use async ainvoke for OpenAI and Gemini
            print("⚡ Running with async ainvoke")
            response = await llm.ainvoke(messages)
            return response.content
 
 
    async def _generate_greeting_response(self, query: str, model: str = None) -> str:
        """Generate a friendly greeting response using LLM for natural conversation"""
        try:
            # Get current time for context
            from datetime import datetime
            current_hour = datetime.now().hour
            current_time = datetime.now().strftime("%H:%M")
 
 
            print(f"🕐 Current time: {current_time} (hour: {current_hour})")
 
 
            # Determine time of day for context
            if 5 <= current_hour < 12:
                time_context = "morning"
            elif 12 <= current_hour < 17:
                time_context = "afternoon"
            elif 17 <= current_hour < 22:
                time_context = "evening"
            else:
                time_context = "night"
 
 
            print(f"⏰ Time context: {time_context}")
 
 
            # Create a natural greeting prompt for the LLM
            greeting_prompt = f"""You are a friendly AI assistant. The user has greeted you with: "{query}"
 
 
Current time context: {time_context}
 
 
Please respond with a warm, natural greeting that:
1. Acknowledges their greeting appropriately
2. Includes time-appropriate well-wishes (good morning/afternoon/evening/night)
3. Shows enthusiasm to help
4. Keeps it concise (1-2 sentences max)
5. Sounds natural and conversational
 
 
Respond naturally as if you're greeting a friend:"""
 
 
            # Get LLM response for greeting - FIXED: Using universal invoker
            llm = self.get_llm_provider(model=model)
            messages = [
                SystemMessage(content=greeting_prompt),
                HumanMessage(content=query)
            ]
 
 
            response = await self._invoke_llm(llm, messages)
            print(f"🎯 LLM-generated greeting response: {response}")
            return response
 
 
        except Exception as e:
            logger.error(f"Error generating LLM greeting response: {e}")
            # Fallback to simple greeting if LLM fails
            fallback_greeting = f"Hi there! How can I help you today?"
            print(
                f"⚠️ Using fallback greeting due to LLM error: {fallback_greeting}")
            return fallback_greeting
 
 
    def _get_content_specific_prompt(self, query_type: str, context: str) -> str:
        """Get content-specific prompt based on query type"""
        base_prompt = "Please answer based on this context when relevant."
 
 
        if query_type == "table":
            return f"{base_prompt} Pay special attention to table data, numerical information, and structured data. When referencing tables, mention specific values and patterns."
 
 
        elif query_type == "figure":
            return f"{base_prompt} Focus on visual elements, charts, graphs, and image descriptions. When referencing figures, describe what they show and any key data points."
 
 
        elif query_type == "mixed":
            return f"{base_prompt} Consider both textual and structured data in your response. Reference tables and figures specifically when they contain relevant information."
 
 
        else:
            return f"{base_prompt} If the context contains tables or figures, reference them specifically when they support your answer."
 
 
    def _enhance_context_with_metadata(self, context: str, sources: list) -> str:
        """Enhance context with metadata information for better LLM understanding"""
        enhanced_context = context
 
 
        # Add metadata summary if available
        if sources:
            enhanced_context += "\n\n**Source Information:**\n"
            for i, source in enumerate(sources, 1):
                enhanced_context += f"- Source {i}: {source}\n"
 
 
        return enhanced_context
 
 
    @staticmethod
    def get_llm_provider(model: str = None, temperature: float = None, top_p: float = None):
        """Enhanced LLM provider with dynamic parameters and smart model detection"""
        # Default parameters
        temperature = temperature if temperature is not None else 0.7
        top_p = top_p if top_p is not None else 0.9
       
        # Smart provider detection from model name
        model_str = str(model).lower() if model else ""
       
        # Detect provider from model name
        if "gemini" in model_str or "palm" in model_str:
            # Google models - async compatible
            final_model = model or "gemini-2.0-flash-exp"
            print(f"🤖 Using Google Gemini: {final_model}")
            return ChatGoogleGenerativeAI(
                model=final_model,
                temperature=temperature,
                top_p=top_p,
                google_api_key=os.getenv("GOOGLE_API_KEY")
            )
       
        elif "llama" in model_str or "mixtral" in model_str or "groq" in model_str:
            # Groq models - return tuple to indicate sync mode needed
            final_model = model or "llama-3.3-70b-versatile"
            print(f"🤖 Using Groq: {final_model} (sync mode)")
            return ("groq", ChatGroq(
                model=final_model,
                temperature=temperature,
                api_key=os.getenv("GROQ_API_KEY")
            ))
       
        else:
            # OpenAI models (default) - async compatible
            final_model = model or "gpt-4o"
            print(f"🤖 Using OpenAI: {final_model}")
            return ChatOpenAI(
                model=final_model,
                temperature=temperature,
                top_p=top_p,
                api_key=os.getenv("OPENAI_API_KEY")
            )
 
    def _generate_no_document_response(self) -> dict:
        """Generate response when no documents are uploaded"""
        response = """I don't have any documents uploaded to reference.
 
Please upload relevant documents first, then I can answer questions about their content.
 
To upload documents:
1. Click the "Upload File" button
2. Select your document (PDF, DOCX, TXT, images supported)
3. Wait for processing to complete
4. Ask questions about the uploaded content"""
 
        return {
            "response": response,
            "context_used": False,
            "out_of_scope": True,
            "reason": "no_documents"
        }
 
    def _generate_out_of_scope_response(self, relevance_check: dict) -> dict:
        """Generate response for out-of-scope queries"""
        document_topics = relevance_check.get("document_topics", [])
        document_filenames = relevance_check.get("document_filenames", [])
        relevance_score = relevance_check.get("relevance_score", 0.0)
 
        # Build helpful response based on available information
        if document_topics:
            topics_text = ", ".join(document_topics)
            response = f"""I can only answer questions about the documents you've uploaded. Your question is outside the scope of the uploaded documents about: **{topics_text}**.
 
**Uploaded documents:** {', '.join(document_filenames)}
 
**Please ask questions related to:**
- {topics_text}
- Specific content from the uploaded documents
- Data, tables, or figures in these documents
 
**Or upload relevant documents** if you need information about your current topic."""
        else:
            response = f"""I can only answer questions about the documents you've uploaded. Your question is outside the scope of the uploaded documents: **{', '.join(document_filenames)}**.
 
**Please ask questions related to:**
- Content from the uploaded documents
- Data, tables, or figures in these documents
- Specific information from these files
 
**Or upload relevant documents** if you need information about your current topic."""
 
        return {
            "response": response,
            "context_used": False,
            "out_of_scope": True,
            "reason": "out_of_scope",
            "relevance_score": relevance_score,
            "document_topics": document_topics,
            "document_filenames": document_filenames
        }
 
    async def _generate_llm_only_response(self, transcript: str, system_prompt: str = None, model: str = None, temperature: float = None, top_p: float = None) -> dict:
        """Generate LLM-only response without document context"""
        try:
            # Use provided parameters or fallback to defaults
            prompt = system_prompt or settings.LLM_SYSTEM_PROMPT
 
            print("🤖 Generating LLM-only response...")
 
 
            # Get LLM with specified parameters - FIXED: Explicit parameter names
            llm = self.get_llm_provider(model=model, temperature=temperature, top_p=top_p)
 
 
            messages = [
                SystemMessage(content=prompt),
                HumanMessage(content=transcript)
            ]
 
 
            # FIXED: Using universal invoker
            response = await self._invoke_llm(llm, messages)
 
 
            return {
                "response": response,
                "context_used": False,
                "mode": "llm_only",
                "out_of_scope": False
            }
 
        except Exception as e:
            logger.error(f"LLM-only response generation error: {e}")
            return {"response": None, "error": str(e)}
 
 
    async def _classify_user_intent(self, user_input: str, model: str = None) -> str:
        """Use LLM to intelligently classify user intent - FIXED: Now fully async"""
        try:
            # Create a prompt for intent classification
            classification_prompt = f"""Analyze this user input and classify it into one of these categories:
 
1. "QUESTION" - User is asking for information, clarification, or seeking knowledge
2. "CONVERSATIONAL" - User is giving acknowledgment, confirmation, simple response, or casual conversation
3. "GREETING" - User is saying hello, hi, or similar greetings
 
Examples:
- "What is AI?" → QUESTION
- "How does machine learning work?" → QUESTION
- "okay" → CONVERSATIONAL
- "thanks" → CONVERSATIONAL
- "got it" → CONVERSATIONAL
- "yes" → CONVERSATIONAL
- "no" → CONVERSATIONAL
- "cool" → CONVERSATIONAL
- "hi there" → GREETING
- "hello" → GREETING
- "good morning" → GREETING
 
 
User input: "{user_input}"
 
 
Respond with only the category name (QUESTION, CONVERSATIONAL, or GREETING)."""
 
 
            # Get LLM response for classification - FIXED: Using universal invoker
            llm = self.get_llm_provider(model=model)
            messages = [
                SystemMessage(content=classification_prompt),
                HumanMessage(content=user_input)
            ]
 
 
            response = await self._invoke_llm(llm, messages)
            intent = response.strip().upper()
 
 
            # Validate response
            if intent in ["QUESTION", "CONVERSATIONAL", "GREETING"]:
                return intent
            else:
                print(
                    f"⚠️ Invalid LLM classification response: '{intent}', defaulting to QUESTION")
                return "QUESTION"
 
 
        except Exception as e:
            logger.error(f"Error in LLM intent classification: {e}")
            print(f"⚠️ LLM classification failed, using fallback logic")
            # Fallback to existing greeting detection
            if self._is_greeting(user_input):
                return "GREETING"
            else:
                return "QUESTION"
 
 
    async def _handle_conversational_response(self, transcript: str, document_mode: bool, model: str = None) -> dict:
        """Handle conversational responses naturally"""
        try:
            # Create a prompt for conversational responses
            conversational_prompt = f"""You are a friendly AI assistant. The user has given a conversational response: "{transcript}"
 
 
This appears to be an acknowledgment, confirmation, or simple response. Please respond naturally and conversationally to:
1. Acknowledge their response appropriately
2. Show enthusiasm to continue helping
3. Encourage them to ask questions or continue the conversation
4. Keep it friendly and engaging
5. If they seem satisfied, offer to help with anything else
 
 
Respond naturally as if you're having a friendly conversation:"""
 
 
            # Get LLM response for conversational reply - FIXED: Using universal invoker
            llm = self.get_llm_provider(model=model)
            messages = [
                SystemMessage(content=conversational_prompt),
                HumanMessage(content=transcript)
            ]
 
 
            response = await self._invoke_llm(llm, messages)
 
 
            return {
                "response": response,
                "mode": "conversational",
                "context_used": False,
                "intent": "conversational"
            }
 
 
        except Exception as e:
            logger.error(f"Error generating conversational response: {e}")
            # Fallback response
            fallback_response = "Great! Is there anything else you'd like to know?"
            return {
                "response": fallback_response,
                "mode": "conversational",
                "context_used": False,
                "intent": "conversational"
            }
 
 
    async def _handle_document_question(self, transcript: str, system_prompt: str = None, model: str = None, temperature: float = None, top_p: float = None) -> dict:
        """Handle document-related questions"""
        try:
            # Use provided parameters or fallback to defaults
            prompt = system_prompt or settings.LLM_SYSTEM_PROMPT
 
 
            # Step 1: Check if documents are uploaded
            print(f"🔍 Checking for active documents...")
            has_docs = self.embedding_service.session_manager.has_active_documents()
            print(f"🔍 Has active documents: {has_docs}")
 
 
            if not has_docs:
                print("❌ No active documents found, returning no-document response")
                return self._generate_no_document_response()
 
 
            # Get current session ID for context
            current_session_id = self.embedding_service.session_manager.get_current_session_id()
            print(f"🔍 Current session: {current_session_id}")
 
            # Step 2: Check query relevance to uploaded documents
            relevance_check = await self.embedding_service.check_query_relevance(transcript, current_session_id)
 
            if not relevance_check["is_relevant"]:
                return self._generate_out_of_scope_response(relevance_check)
 
            # Step 3: Check for relevant documents with enhanced retrieval
            relevant_docs = await self.embedding_service.find_relevant_chunks(transcript, top_k=10, session_id=current_session_id)
 
            # Step 4: Inject document context if available
            if relevant_docs:
                # Enhanced context with metadata information
                context_with_metadata = self._enhance_context_with_metadata(
                    relevant_docs['context'], relevant_docs['sources'])
 
                # Add content-aware prompts based on query type
                query_type = self._classify_query_type(transcript)
                content_prompt = self._get_content_specific_prompt(
                    query_type, relevant_docs['context'])
 
                prompt += f"\n\nRelevant document context:\n{context_with_metadata}\n\n{content_prompt}"
                print(
                    f"✅ Added enhanced document context with {query_type}-specific prompts")
            else:
                print("✅ No relevant document context found")
 
            # Step 5: Get LLM with specified parameters
            llm = self.get_llm_provider(model, temperature, top_p)
 
            messages = [
                SystemMessage(content=prompt),
                HumanMessage(content=transcript)
            ]
 
 
            # FIXED: Using universal invoker
            response = await self._invoke_llm(llm, messages)
 
 
            # Return response with enhanced sources if documents were used
            result = {"response": response, "mode": "document"}
            if relevant_docs:
                result["sources"] = relevant_docs["sources"]
                result["context_used"] = True
 
                logger.info(
                    f"Document mode response generated using {len(relevant_docs['sources'])} sources: {[s.get('filename', str(s)) if isinstance(s, dict) else str(s) for s in relevant_docs['sources']]}")
            else:
                result["context_used"] = False
                print("✅ Response generated without document context")
                logger.info(
                    "Document mode response generated without document context")
 
            return result
 
        except Exception as e:
            logger.error(f"Document question handling error: {e}")
            return {"response": None, "error": str(e)}
 