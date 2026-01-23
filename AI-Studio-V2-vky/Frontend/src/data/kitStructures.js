export const kitStructures = {
  // 1. React Project Startup Kit
  1: {
    name: "React Project Startup Kit",
    description: "Production-ready React project using Vite, routing, and scalable state management",
    githublink: "https://github.com/GurjotSingh25/REACT_STRUCTURE.git",
     // ⭐ NEW: Recommendation metadata
    recommendedFor: {
      product: ["Web App", "Full Stack Application"],
      experience: ["Beginner", "Intermediate"],
      team: ["Solo", "2–5"],
      timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
      priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
      tech: [
        "React / Next.js",
        "Authentication",
        "Database"
      ]
    },

    // ⭐ NEW: Display metadata
    skillLevel: "Beginner → Intermediate",
    teamFit: "Solo / Small Team",
    setupComplexity: "Low",
    scalability: "Medium",

    // ⭐ NEW: Human explanation (used in results page)
    useCases: [
      "SaaS dashboards",
      "Internal tools",
      "AI product frontends",
      "MVPs & rapid prototypes"
    ],
    structure: {
      "public/": {
        type: "folder",
        description: "Public static assets served directly by the browser",
        children: {
          "index.html": {
            type: "file",
            description: "Main HTML entry point for the React application",
            content: `<!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>React Starter Kit</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" src="/src/main.jsx"></script>
            </body>
          </html>`
                    },
                    "favicon.ico": { type: "file", description: "Browser tab icon" }
                  }
                },

                "src/": {
                  type: "folder",
                  description: "Main source code directory",
                  children: {
                    "main.jsx": {
                      type: "file",
                      description: "Application entry point",
                      important: true,
                      content: `import React from 'react'
          import ReactDOM from 'react-dom/client'
          import { BrowserRouter } from 'react-router-dom'
          import App from './App.jsx'
          import './styles/index.css'

          ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </React.StrictMode>
          )`
          },

          "App.jsx": {
            type: "file",
            description: "Root component with layout & routing",
            important: true,
            content: `import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Analytics from './pages/Analytics.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <NavLink 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Starter Kit
          </NavLink>
          
          <div className="flex gap-8 font-medium">
            <NavLink to="/" className={({ isActive }) => 
              isActive ? "text-cyan-400" : "hover:text-cyan-400 transition-colors"
            }>
              Home
            </NavLink>
            <NavLink to="/chat" className={({ isActive }) => 
              isActive ? "text-cyan-400" : "hover:text-cyan-400 transition-colors"
            }>
              Chat
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => 
              isActive ? "text-cyan-400" : "hover:text-cyan-400 transition-colors"
            }>
              Analytics
            </NavLink>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  )
}`
          },

          "features/": {
            type: "folder",
            description: "Feature-based modules",
            important: true,
            children: {
              "chat/": {
                type: "folder",
                description: "Chat feature module",
                children: {
                  "components/": {
                    type: "folder",
                    children: {
                      "ChatWindow.jsx": {
                        type: "file",
                        content: `import { useChat } from '../hooks/useChat'

export default function ChatWindow() {
  const { messages, inputValue, setInputValue, sendMessage, isConnected } = useChat()

  return (
    <div className="h-[70vh] flex flex-col border border-slate-700 rounded-xl bg-slate-900/40 backdrop-blur-sm">
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <div className={\`w-3 h-3 rounded-full \${isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}\`} />
        <span className="font-medium">AI Assistant</span>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={\`flex \${msg.isUser ? 'justify-end' : 'justify-start'}\`}>
            <div className={\`max-w-[80%] px-4 py-2.5 rounded-2xl \${msg.isUser 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-800 text-slate-100'}\`}>
              {msg.text}
              <div className="text-xs opacity-60 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-3">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-3 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}`
                      }
                    }
                  },
                  "hooks/": {
                    type: "folder",
                    children: {
                      "useChat.js": {
                        type: "file",
                        content: `import { useState, useEffect } from 'react'

export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate connection
    setTimeout(() => setIsConnected(true), 1200)
  }, [])

  const sendMessage = () => {
    if (!inputValue.trim()) return
    
    const userMsg = {
      id: Date.now(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: Date.now()
    }
    
    setMessages(prev => [...prev, userMsg])
    setInputValue('')

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "This is a simulated response from the AI assistant! 🚀",
        isUser: false,
        timestamp: Date.now()
      }])
    }, 800)
  }

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isConnected
  }
}`
                      }
                    }
                  }
                }
              }
            }
          },

          "shared/": {
            type: "folder",
            children: {
              "utils/": {
                type: "folder",
                children: {
                  "api.js": {
                    type: "file",
                    important: true,
                    content: `import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 12000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`
  }
  return config
})

export default api`
                  }
                }
              }
            }
          },

          "pages/": {
            type: "folder",
            children: {
              "Home.jsx": {
                type: "file",
                content: `export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
        Welcome to React Starter Kit
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
        Modern, scalable React + Vite starter with feature-sliced architecture,
        TypeScript-ready structure and Tailwind CSS.
      </p>
      <div className="flex flex-wrap gap-6 justify-center">
        <a href="/chat" className="px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold hover:scale-105 transition-transform">
          Try the Chat →
        </a>
      </div>
    </div>
  )
}`
              },
              "Chat.jsx": {
                type: "file",
                content: `import ChatWindow from '../features/chat/components/ChatWindow'

export default function Chat() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">AI Chat Interface</h1>
      <ChatWindow />
    </div>
  )
}`
              },
              "Analytics.jsx": {
                type: "file",
                content: `export default function Analytics() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-cyan-400 mb-6">Analytics Dashboard</h1>
      <p className="text-xl text-slate-400">Coming soon... 📊</p>
    </div>
  )
}`
              }
            }
          },

          "styles/": {
            type: "folder",
            children: {
              "index.css": {
                type: "file",
                content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground: #f1f5f9;
  --background: #020617;
}

body {
  @apply bg-background text-foreground min-h-screen;
  font-family: 'Inter', system-ui, sans-serif;
}`
              }
            }
          }
        }
      },

      "package.json": {
        type: "file",
        important: true,
        content: `{
  "name": "react-vite-starter",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.37.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-refresh": "^0.4.11",
    "tailwindcss": "^3.4.13",
    "vite": "^5.4.8"
  }
}`
      },

      "vite.config.js": {
        type: "file",
        important: true,
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true
  }
})`
      },

      ".env.development": {
        type: "file",
        important: true,
        content: `VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=React Starter Kit`
      },

      "README.md": {
        type: "file",
        important: true,
        content: `# React Vite Starter Kit

Modern React + Vite starter template

## Features
- Vite + React 18
- Tailwind CSS
- React Router v6
- Feature-sliced architecture
- Axios API client
- TypeScript-ready structure

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`

Happy coding! 🚀`
      }
    }
  },

  // 2. FastAPI AI Backend
 2: {
  name: "FastAPI AI Backend",
  description: "Production-ready FastAPI backend with AI/LLM integrations",
  githublink:"https://github.com/Vikrantthakur64/FASTAPI_AI_BACKEND",
  recommendedFor: {
    product: ["Backend", "Web App", "Full Stack Application"],
    experience: ["Beginner", "Intermediate", "Advanced"],
    team: ["Solo", "2–5"],
    timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
    priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
    tech: [
      "FastAPI AI , Python",
      "Authentication",
      "Backend, AI"
    ]
  },
  structure: {
    "app/": {
      type: "folder",
      description: "Main application directory",
      children: {
        "__init__.py": {
          type: "file",
          description: "Python package initializer",
          content: ""
        },
        "main.py": {
          type: "file",
          description: "FastAPI app entrypoint",
          important: true,
          content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .config import settings
from .database import engine
from .auth import router as auth_router
from .ai import router as ai_router

app = FastAPI(title="Beginner AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(ai_router, prefix="/ai", tags=["ai"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`

        },
        "config.py": {
          type: "file",
          description: "Settings and environment config",
          important: true,
          content: `from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    openai_api_key: str
    stripe_secret_key: str

    class Config:
        env_file = ".env"

settings = Settings()`

        },
        "database.py": {
          type: "file",
          description: "Database connection and session management",
          content: `from fastapi import APIRouter, Depends
from openai import AsyncOpenAI
from .config import settings
from .auth import get_current_user

router = APIRouter()
client = AsyncOpenAI(api_key=settings.openai_api_key)

@router.post("/chat")
async def chat(prompt: str, current_user=Depends(get_current_user)):
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return {"reply": response.choices[0].message.content} `
        },
        "models.py": {
          type: "file",
          description: "SQLAlchemy database models",
          content: `from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    credits = Column(Float, default=100.0)  # Starting credits
    created_at = Column(String, server_default=func.now()) `
        },
        "auth.py": {
          type: "file",
          description: "Authentication routes and logic",
          content: `from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Annotated

from . import utils, models, database, schemas

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate, db: Annotated[Session, Depends(database.get_db)]):
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = utils.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created"}

@router.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
                response: Response, 
                db: Annotated[Session, Depends(database.get_db)]):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = utils.create_access_token(data={"sub": user.email})
    response.set_cookie(
        key="access_token", 
        value=access_token, 
        httponly=True, 
        max_age=1800  # 30 min
    )
    return {"msg": "Login successful"} `
        },
        "ai.py": {
          type: "file",
          description: "AI/LLM endpoints",
          content: ` from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
import stripe
from typing import Annotated

from . import config, database, models, utils
from .auth import get_current_user

router = APIRouter()
settings = config.settings
stripe.api_key = settings.stripe_secret_key
client = AsyncOpenAI(api_key=settings.openai_api_key)

class ChatRequest(BaseModel):
    message: str

@router.get("/me")
async def me(current_user=Depends(get_current_user), 
             db=Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    return {"email": user.email, "credits": user.credits}

@router.post("/chat")
async def chat(request: ChatRequest, 
               current_user=Depends(get_current_user),
               db=Depends(database.get_db)):
    user = db.query(models.User).filter(models.User.email == current_user["email"]).first()
    if user.credits <= 0:
        raise HTTPException(status_code=402, detail="No credits left")
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": request.message}],
            max_tokens=500
        )
        reply = response.choices[0].message.content
        tokens_used = len(request.message) / 4 + 50  # Rough estimate
        
        user.credits -= tokens_used * 0.01  # $0.01 per token approx
        db.commit()
        
        return {"reply": reply, "credits_left": user.credits}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) `
 
        },
        "utils.py": {
          type: "file",
          description: "Utility functions (JWT, password hash)",
          content: `from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from fastapi import Request
from .config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=ALGORITHM)

async def get_current_user(request: Request, db=Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token") `
        }
      }
    },
    ".env.example": {
      type: "file",
      description: "Environment variables template",
      important: true,
      content: `DATABASE_URL=sqlite+aiosqlite:///./app.db
SECRET_KEY=your-super-secret-key-change-in-production
OPENAI_API_KEY=sk-your-openai-key
STRIPE_SECRET_KEY=sk_test-your-stripe-key `
    },
    "requirements.txt": {
      type: "file",
      description: "Python dependencies",
      important: true,
      content: `fastapi==0.115.0
uvicorn==0.30.6
sqlalchemy==2.0.35
alembic==1.13.2
pydantic==2.9.2
pydantic-settings==2.5.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
openai==1.51.2
stripe==11.2.0
python-dotenv==1.0.1 `
    },
    "README.md": {
      type: "file",
      description: "Project documentation",
      important: true,
      content: `# FastAPI AI Backend 🚀

Production-ready FastAPI backend with AI/LLM integrations, JWT auth, and Stripe payments. Perfect for your AI-Studio platform.

## ✨ Features

- **FastAPI** with async/await support
- **JWT Authentication** (cookie-based, secure)
- **AI Chat** with OpenAI/Groq integration
- **Credit System** with Stripe billing
- **SQLAlchemy** async database (SQLite/MySQL ready)
- **CORS** configured for React frontend
- **Production-ready** Docker support

## 🛠 Quick Start

### 1. Clone & Install
bash
git clone <your-repo>
cd fastapi-ai-backend
pip install -r requirements.txt ` 
    }
  }
}
,
  // 3. RAG Application Kit
 3: {
  name: "RAG Application Kit",
  featured: true,
  githublink:"https://github.com/Vikrantthakur64/RAG_Application_Kit",
  description: "Production-ready RAG system with FAISS vector store",
      recommendedFor: {
      product: ["Backend", "Web App", "AI"],
      experience: ["Beginner", "Intermediate", "Advanced"],
      team: ["2-5"],
      timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
      priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
      tech: [
        "Python",
        "AI"
      ]
    },
  structure: {
    "app/": {
      type: "folder",
      children: {
        "main.py": {
          type: "file",
          important: true,
          content: `
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.rag.generator import generate_answer
from app.services.rag.indexer import index_documents
from app.config import settings

app = FastAPI(
    title="RAG Application Kit",
    description="Production RAG system with FAISS vector store",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.get("/health")
async def health():
    return {"status": "ok", "vector_store": settings.VECTOR_DB_PATH}

@app.post("/rag/query")
async def query_rag(request: QueryRequest):
    answer = await generate_answer(request.question)
    return {
        "answer": answer["answer"],
        "sources": answer["sources"],
        "confidence": answer.get("confidence", 0.0)
    }

@app.post("/documents/index")
async def upload_documents(file: UploadFile = File(...)):
    if not file.filename.endswith((".pdf", ".docx", ".txt")):
        raise HTTPException(400, "Unsupported file type")
    return await index_documents(file)

@app.delete("/documents/clear")
async def clear_vector_store():
    from app.services.vector_store.faiss_store import clear_store
    clear_store()
    return {"status": "cleared"}
`
        },

        "config.py": {
          type: "file",
          important: true,
          content: `
import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    VECTOR_DB_PATH: str = "data/vector_store"
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    LLM_MODEL: str = "gpt-4o-mini"
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 200
    TOP_K: int = 5

    class Config:
        env_file = ".env"

settings = Settings()
os.makedirs(settings.VECTOR_DB_PATH, exist_ok=True)
`
        },

        "services/": {
          type: "folder",
          children: {
            "vector_store/": {
              type: "folder",
              children: {
                "faiss_store.py": {
                  type: "file",
                  content: `
import faiss
import numpy as np
import pickle
import os
from app.config import settings

class FAISSVectorStore:
    def __init__(self):
        self.index_path = f"{settings.VECTOR_DB_PATH}/faiss.index"
        self.metadata_path = f"{settings.VECTOR_DB_PATH}/metadata.pkl"
        self._load_index()

    def _load_index(self):
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
            with open(self.metadata_path, "rb") as f:
                self.metadata = pickle.load(f)
        else:
            self.index = faiss.IndexFlatL2(1536)
            self.metadata = []

    def add_embeddings(self, embeddings, metadata):
        self.index.add(np.stack(embeddings))
        self.metadata.extend(metadata)
        self._save()

    def search(self, query_embedding, k=5):
        distances, indices = self.index.search(query_embedding, k)
        return [
            {
                "content": self.metadata[i]["content"],
                "score": 1 - distances[0][idx]
            }
            for idx, i in enumerate(indices[0])
            if i < len(self.metadata)
        ]

    def _save(self):
        faiss.write_index(self.index, self.index_path)
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata, f)

vector_store = FAISSVectorStore()
`
                }
              }
            },

            "embeddings/": {
              type: "folder",
              children: {
                "embedding_service.py": {
                  type: "file",
                  content: `
from openai import AsyncOpenAI
import numpy as np
from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def embed_query(text: str):
    response = await client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=text
    )
    return np.array(response.data[0].embedding, dtype=np.float32)

async def embed_documents(texts):
    response = await client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=texts
    )
    return [np.array(e.embedding, dtype=np.float32) for e in response.data]
`
                }
              }
            },

            "rag/": {
              type: "folder",
              children: {
                "retriever.py": {
                  type: "file",
                  content: `
from app.services.embeddings.embedding_service import embed_query
from app.services.vector_store.faiss_store import vector_store

async def retrieve_documents(query: str, k: int = 5):
    query_embedding = await embed_query(query)
    return vector_store.search(query_embedding, k)
`
                },

                "generator.py": {
                  type: "file",
                  content: `
from openai import AsyncOpenAI
from app.services.rag.retriever import retrieve_documents
from app.config import settings

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

async def generate_answer(question: str):
    docs = await retrieve_documents(question)
    context = "\\n\\n".join(d["content"] for d in docs)

    prompt = f"""
Answer using ONLY the context below.

Context:
{context}

Question:
{question}

Answer:
"""

    response = await client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    return {
        "answer": response.choices[0].message.content,
        "sources": docs,
        "confidence": sum(d["score"] for d in docs) / len(docs)
    }
`
                },

                "indexer.py": {
                  type: "file",
                  content: `
import PyPDF2
from docx import Document
from app.services.embeddings.embedding_service import embed_documents
from app.services.vector_store.faiss_store import vector_store
from app.config import settings

async def index_documents(file):
    raw = await file.read()
    text = raw.decode(errors="ignore")

    chunks = [
        text[i:i+settings.CHUNK_SIZE]
        for i in range(0, len(text), settings.CHUNK_SIZE - settings.CHUNK_OVERLAP)
    ]

    embeddings = await embed_documents(chunks)
    metadata = [{"content": c, "source": file.filename} for c in chunks]
    vector_store.add_embeddings(embeddings, metadata)

    return {"chunks": len(chunks), "source": file.filename}
`
                }
              }
            }
          }
        },

        "requirements.txt": {
          type: "file",
          important: true,
          content: `
fastapi
uvicorn
openai
faiss-cpu
pydantic-settings
python-docx
PyPDF2
numpy
python-multipart
`
        },

        ".env": {
          type: "file",
          content: `
OPENAI_API_KEY=sk-xxxxxxxx
`
        }
      }
    }
  }
},

  // Django Backend Starter Kit
 4: {
  name: "Django Backend Starter Kit",
  featured: true,
  githublink:"https://github.com/Vikrantthakur64/Django_Backend_Starter_Kit.git", 
  description: "Django with clean architecture",
  recommendedFor: {
    product: ["Backend", "Web App"],
    experience: ["Beginner", "Intermediate"],
    team: ["Solo", "2–5"],
    timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
    priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
    tech: ["Python", "Django", "Django REST Framework"]
  },
  structure: {
    "manage.py": {
      type: "file",
      description: "Django project entrypoint",
      important: true,
      content: `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

if __name__ == '__main__':
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv) `
    },

    "config/": {
      type: "folder",
      description: "Project configuration and settings",
      children: {
        "__init__.py": {
          type: "file",
          description: "Config package initializer",
          content: ""
        },
        "asgi.py": {
          type: "file",
          description: "ASGI configuration",
          content: `import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
application = get_asgi_application() `
        },
        "wsgi.py": {
          type: "file",
          description: "WSGI configuration",
          content: `import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.base')
application = get_wsgi_application() `
        },
        "urls.py": {
          type: "file",
          description: "Root URL routing",
          content: `from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += i18n_patterns(
    path('api/v1/', include('apps.users.urls')),
) `
        },
        "settings/": {
          type: "folder",
          description: "Environment-based settings",
          children: {
            "__init__.py": {
              type: "file",
              description: "Settings initializer",
              content: ""
            },
            "base.py": {
              type: "file",
              description: "Base settings",
              content: `from pathlib import Path
from decouple import config
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [s.strip() for s in v.split(',')])

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'apps.users',
    'apps.common',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'
ASGI_APPLICATION = 'config.asgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'apps.common.permissions.IsAuthenticated',
    ],
}

# CORS
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=lambda v: [s.strip() for s in v.split(',')])
CORS_ALLOW_CREDENTIALS = True `
            },
            "dev.py": {
              type: "file",
              description: "Development settings",
              content: `from .base import *

DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1'] `
            },
            "prod.py": {
              type: "file",
              description: "Production settings",
              content: `from .base import *
import dj_database_url

DEBUG = False
ALLOWED_HOSTS = ['*']

DATABASES['default'] = dj_database_url.config(default='sqlite:///db.sqlite3')
DATABASES['default']['CONN_MAX_AGE'] = 600 `
            }
          }
        }
      }
    },

    "apps/": {
      type: "folder",
      description: "Application modules",
      children: {
        "__init__.py": {
          type: "file",
          description: "Apps initializer",
          content: ""
        },

        "users/": {
          type: "folder",
          description: "User management module",
          children: {
            "__init__.py": {
              type: "file",
              description: "Users module initializer",
              content: ""
            },
            "admin.py": {
              type: "file",
              description: "Admin configuration",
              content: `from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'date_joined')
    list_filter = ('is_active', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('avatar',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('avatar',)}),
    ) `
            },
            "apps.py": {
              type: "file",
              description: "Users app configuration",
              content: `ffrom django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users' `
            },
            "models.py": {
              type: "file",
              description: "User models",
              content: `from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email `
            },
            "serializers.py": {
              type: "file",
              description: "User serializers",
              content: `from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'first_name', 'last_name', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username', validated_data['email']),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'avatar', 'date_joined')
        read_only_fields = ('id', 'date_joined') `
            },
            "views.py": {
              type: "file",
              description: "User views",
              content: `from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserRegistrationSerializer, UserSerializer
from .models import User
from apps.common.responses import APIResponse

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    users = User.objects.all()[:10]
    serializer = UserSerializer(users, many=True)
    return APIResponse(data=serializer.data)  `
            },
            "urls.py": {
              type: "file",
              description: "User routes",
              content: `from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('users/', views.user_list, name='user_list'),
] `
            },
            // "migrations/": {
            //   type: "folder",
            //   description: "Database migrations",
            //   children: {
            //     "__init__.py": {
            //       type: "file",
            //       description: "Migrations initializer",
            //       content: ""
            //     }
            //   }
            // }
          }
        }
      }
    },

    "common/": {
      type: "folder",
      description: "Shared utilities",
      children: {
        "__init__.py": {
          type: "file",
          description: "Common initializer",
          content: ""
        },
        "permissions.py": {
          type: "file",
          description: "Custom permissions",
          content: `from rest_framework.permissions import BasePermission

class IsAuthenticated(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return obj.user == request.user `
        },
        "responses.py": {
          type: "file",
          description: "Standard API responses",
          content: `from rest_framework.response import Response
from rest_framework import status

class APIResponse(Response):
    def __init__(self, success=True, message=None, data=None, status_code=None, **kwargs):
        payload = {
            'success': success,
            'message': message or ('Success' if success else 'Error'),
            'data': data,
            **kwargs
        }
        super().__init__(data=payload, status=status_code or (status.HTTP_200_OK if success else status.HTTP_400_BAD_REQUEST)) `
        },
        "utils.py": {
          type: "file",
          description: "Utility helpers",
          content: `import uuid
from django.utils.crypto import get_random_string

def generate_unique_filename(filename):
    name, ext = os.path.splitext(filename)
    unique_filename = f"{uuid.uuid4()}{ext}"
    return unique_filename

def generate_otp(length=6):
    return get_random_string(length=length, allowed_chars='0123456789') `
        }
      }
    },

    "tests/": {
      type: "folder",
      description: "Test cases",
      children: {
        "__init__.py": {
          type: "file",
          description: "Tests initializer",
          content: ""
        }
      }
    },

    ".env": {
      type: "file",
      description: "Environment variables",
      content: `SECRET_KEY=your-super-secret-key-here-change-in-production
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000 `
    },

    "requirements.txt": {
      type: "file",
      description: "Python dependencies",
      content: `Django==5.0.7
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
python-decouple==3.8
django-cors-headers==4.4.0
Pillow==10.4.0 `
    },

    "README.md": {
      type: "file",
      description: "Project documentation",
      content: `# Install dependencies
pip install -r requirements.txt

# Make migrations
python manage.py makemigrations users

# Migrate database
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run server
python manage.py runserver `
    }
  }
}
,
//Node.js Express Starter Kit
    5: {
    name: "Node.js Express Starter Kit",
    description: "Express backend with RAG integration (FAISS + OpenAI)",
    githublink:"https://github.com/Vikrantthakur64/Node.js_Express_Starter_Kit.git",
    featured: true,
        recommendedFor: {
        product: ["Backend", "Web App"],
        experience: ["Beginner", "Intermediate"],
        team: ["solo","2-5"],
        timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
        priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
        tech: [
          "Javascript",
        ]
      },
    structure: {
      "package.json": {
        type: "file",
        important: true,
        content: `
  {
    "name": "express-rag-starter",
    "version": "1.0.0",
    "description": "Express backend with RAG integration",
    "main": "src/index.js",
    "scripts": {
      "start": "node src/index.js",
      "dev": "nodemon src/index.js"
    },
    "dependencies": {
      "express": "^4.19.2",
      "openai": "^4.52.7",
      "cors": "^2.8.5",
      "dotenv": "^16.4.5",
      "multer": "^1.4.5-lts.1",
      "faiss-node": "^0.5.1",
      "pdf-parse": "^1.1.1",
      "mammoth": "^1.8.0"
    },
    "devDependencies": {
      "nodemon": "^3.1.4"
    }
  }
  `
      },

      "src/": {
        type: "folder",
        children: {
          "index.js": {
            type: "file",
            important: true,
            content: `
  require('dotenv').config();
  const express = require('express');
  const cors = require('cors');
  const ragRoutes = require('./routes/rag');

  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/rag', ragRoutes);

  app.listen(PORT, () => {
    console.log(\`RAG Express server running on port \${PORT}\`);
  });
  `
          },

          "routes/": {
            type: "folder",
            children: {
              "rag.js": {
                type: "file",
                content: `
  const express = require('express');
  const multer = require('multer');
  const { queryRAG, uploadDocument, clearDocuments } = require('../controllers/ragController');

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }
  });

  const router = express.Router();

  router.post('/query', queryRAG);
  router.post('/documents', upload.single('file'), uploadDocument);
  router.delete('/documents', clearDocuments);

  module.exports = router;
  `
              }
            }
          },

          "controllers/": {
            type: "folder",
            children: {
              "ragController.js": {
                type: "file",
                content: `
  const { embedQuery, generateAnswer } = require('../services/openaiService');
  const vectorStore = require('../services/vectorStore');
  const { indexDocument } = require('../services/documentProcessor');

  async function queryRAG(req, res) {
    try {
      const { question } = req.body;
      const queryEmbedding = await embedQuery(question);
      const docs = await vectorStore.search(queryEmbedding);

      const context = docs.map(d => d.content).join('\\n\\n');
      const prompt = \`Answer based ONLY on this context:\\n\\n\${context}\\n\\nQuestion: \${question}\`;

      const answer = await generateAnswer(prompt);

      res.json({
        answer,
        sources: docs,
        confidence: docs.reduce((s, d) => s + d.score, 0) / docs.length
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async function uploadDocument(req, res) {
    try {
      const result = await indexDocument(req.file);
      res.json({ status: 'success', ...result });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async function clearDocuments(req, res) {
    try {
      await vectorStore.clear();
      res.json({ status: 'cleared' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  module.exports = { queryRAG, uploadDocument, clearDocuments };
  `
              }
            }
          },

          "services/": {
            type: "folder",
            children: {
              "openaiService.js": {
                type: "file",
                content: `
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const EMBEDDING_MODEL = 'text-embedding-3-small';
  const LLM_MODEL = 'gpt-4o-mini';

  async function embedQuery(text) {
    const res = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text
    });
    return Float32Array.from(res.data[0].embedding);
  }

  async function generateAnswer(prompt) {
    const res = await openai.chat.completions.create({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1
    });
    return res.choices[0].message.content;
  }

  module.exports = { embedQuery, generateAnswer };
  `
              },

              "vectorStore.js": {
                type: "file",
                content: `
  const { IndexFlatL2 } = require('faiss-node');
  const fs = require('fs').promises;
  const path = require('path');

  class VectorStore {
    constructor() {
      this.dimension = 1536;
      this.indexPath = path.join(__dirname, '../data/vector.index');
      this.metadataPath = path.join(__dirname, '../data/metadata.json');
      this.index = new IndexFlatL2(this.dimension);
      this.metadata = [];
      this.init();
    }

    async init() {
      await fs.mkdir(path.dirname(this.indexPath), { recursive: true });
    }

    async add(embeddings, metadata) {
      this.index.add(embeddings);
      this.metadata.push(...metadata);
      await this.save();
    }

    async search(queryEmbedding, k = 5) {
      const res = this.index.search(queryEmbedding, k);
      return res.labels.map((label, i) => ({
        content: this.metadata[label]?.content || '',
        score: 1 - (res.distances[i] / 2),
        metadata: this.metadata[label]
      })).filter(d => d.content);
    }

    async save() {
      await fs.writeFile(this.indexPath, Buffer.from(this.index.save()));
      await fs.writeFile(this.metadataPath, JSON.stringify(this.metadata));
    }

    async clear() {
      this.index = new IndexFlatL2(this.dimension);
      this.metadata = [];
      await this.save();
    }
  }

  module.exports = new VectorStore();
  `
              },

              "documentProcessor.js": {
                type: "file",
                content: `
  const pdf = require('pdf-parse');
  const mammoth = require('mammoth');
  const { embedQuery } = require('./openaiService');
  const vectorStore = require('./vectorStore');

  async function chunkText(text, size = 1000, overlap = 200) {
    const words = text.split(/\\s+/);
    const chunks = [];
    for (let i = 0; i < words.length; i += size - overlap) {
      chunks.push(words.slice(i, i + size).join(' '));
    }
    return chunks;
  }

  async function indexDocument(file) {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      text = (await pdf(file.buffer)).text;
    } else if (file.mimetype.includes('wordprocessingml')) {
      text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
    } else {
      text = file.buffer.toString();
    }

    const chunks = await chunkText(text);
    const embeddings = await Promise.all(chunks.map(embedQuery));

    const metadata = chunks.map((c, i) => ({
      content: c,
      source: file.originalname,
      chunkIndex: i
    }));

    await vectorStore.add(embeddings, metadata);
    return { chunks: chunks.length, source: file.originalname };
  }

  module.exports = { indexDocument };
  `
              }
            }
          }
        }
      },

      ".env": {
        type: "file",
        content: `
  OPENAI_API_KEY=sk-xxxx
  PORT=3001
  `
      }
    }
  }
,
//Next.js Fullstack Starter Kit

  7: {
    name: "Next.js Fullstack Starter Kit",
    description: "Production-ready Next.js 14 with App Router, API routes, authentication, and database integration",
        recommendedFor: {
        product: ["Frontend", "Web App"],
        experience: ["Beginner", "Intermediate"],
        team: ["solo","2-5"],
        timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
        priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
        tech: [
          "Javascript, Next.js",
        ]
      },
    structure: {
      "src/": {
        type: "folder",
        description: "Source code directory",
        children: {
          "app/": {
            type: "folder",
            description: "Next.js App Router (Next.js 13+)",
            important: true,
            children: {
              "layout.tsx": {
                type: "file",
                description: "Root layout with providers and metadata",
                important: true
              },
              "page.tsx": {
                type: "file",
                description: "Home page component",
                important: true
              },
              "globals.css": {
                type: "file",
                description: "Global styles and Tailwind directives"
              },
              "api/": {
                type: "folder",
                description: "API routes (serverless functions)",
                important: true,
                children: {
                  "auth/": {
                    type: "folder",
                    description: "Authentication endpoints",
                    children: {
                      "[...nextauth]/": {
                        type: "folder",
                        children: {
                          "route.ts": {
                            type: "file",
                            description: "NextAuth.js API handler",
                            important: true
                          }
                        }
                      },
                      "register/": {
                        type: "folder",
                        children: {
                          "route.ts": {
                            type: "file",
                            description: "User registration endpoint"
                          }
                        }
                      }
                    }
                  },
                  "users/": {
                    type: "folder",
                    description: "User management endpoints",
                    children: {
                      "route.ts": {
                        type: "file",
                        description: "GET all users"
                      },
                      "[id]/": {
                        type: "folder",
                        children: {
                          "route.ts": {
                            type: "file",
                            description: "GET/PUT/DELETE user by ID"
                          }
                        }
                      }
                    }
                  },
                  "chat/": {
                    type: "folder",
                    description: "Chat API endpoints",
                    children: {
                      "route.ts": {
                        type: "file",
                        description: "Chat message endpoints"
                      }
                    }
                  },
                  "upload/": {
                    type: "folder",
                    description: "File upload endpoint",
                    children: {
                      "route.ts": {
                        type: "file",
                        description: "File upload handler"
                      }
                    }
                  }
                }
              },
              "(auth)/": {
                type: "folder",
                description: "Auth route group (shared layout)",
                children: {
                  "layout.tsx": {
                    type: "file",
                    description: "Auth pages layout"
                  },
                  "login/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Login page"
                      }
                    }
                  },
                  "register/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Registration page"
                      }
                    }
                  },
                  "forgot-password/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Password reset page"
                      }
                    }
                  }
                }
              },
              "(dashboard)/": {
                type: "folder",
                description: "Dashboard route group (protected routes)",
                important: true,
                children: {
                  "layout.tsx": {
                    type: "file",
                    description: "Dashboard layout with sidebar",
                    important: true
                  },
                  "dashboard/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Dashboard home page"
                      }
                    }
                  },
                  "chat/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Chat interface page"
                      }
                    }
                  },
                  "analytics/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "Analytics dashboard"
                      }
                    }
                  },
                  "settings/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "User settings page"
                      }
                    }
                  },
                  "profile/": {
                    type: "folder",
                    children: {
                      "page.tsx": {
                        type: "file",
                        description: "User profile page"
                      }
                    }
                  }
                }
              },
              "error.tsx": {
                type: "file",
                description: "Error boundary component"
              },
              "loading.tsx": {
                type: "file",
                description: "Loading UI component"
              },
              "not-found.tsx": {
                type: "file",
                description: "404 page"
              }
            }
          },
          "components/": {
            type: "folder",
            description: "Reusable React components",
            important: true,
            children: {
              "ui/": {
                type: "folder",
                description: "Base UI components (shadcn/ui style)",
                children: {
                  "button.tsx": {
                    type: "file",
                    description: "Button component with variants"
                  },
                  "input.tsx": {
                    type: "file",
                    description: "Form input component"
                  },
                  "card.tsx": {
                    type: "file",
                    description: "Card container component"
                  },
                  "dialog.tsx": {
                    type: "file",
                    description: "Modal dialog component"
                  },
                  "dropdown-menu.tsx": {
                    type: "file",
                    description: "Dropdown menu component"
                  },
                  "toast.tsx": {
                    type: "file",
                    description: "Toast notification component"
                  },
                  "tabs.tsx": {
                    type: "file",
                    description: "Tabs component"
                  }
                }
              },
              "features/": {
                type: "folder",
                description: "Feature-specific components",
                children: {
                  "chat/": {
                    type: "folder",
                    children: {
                      "ChatWindow.tsx": {
                        type: "file",
                        description: "Main chat interface"
                      },
                      "MessageList.tsx": {
                        type: "file",
                        description: "Chat message list"
                      },
                      "MessageInput.tsx": {
                        type: "file",
                        description: "Message input box"
                      }
                    }
                  },
                  "analytics/": {
                    type: "folder",
                    children: {
                      "StatsCard.tsx": {
                        type: "file",
                        description: "Analytics stat card"
                      },
                      "Chart.tsx": {
                        type: "file",
                        description: "Chart visualization"
                      }
                    }
                  },
                  "auth/": {
                    type: "folder",
                    children: {
                      "LoginForm.tsx": {
                        type: "file",
                        description: "Login form component"
                      },
                      "RegisterForm.tsx": {
                        type: "file",
                        description: "Registration form"
                      }
                    }
                  }
                }
              },
              "layouts/": {
                type: "folder",
                description: "Layout components",
                children: {
                  "Header.tsx": {
                    type: "file",
                    description: "App header/navbar"
                  },
                  "Sidebar.tsx": {
                    type: "file",
                    description: "Dashboard sidebar"
                  },
                  "Footer.tsx": {
                    type: "file",
                    description: "App footer"
                  }
                }
              },
              "providers/": {
                type: "folder",
                description: "Context providers",
                children: {
                  "ThemeProvider.tsx": {
                    type: "file",
                    description: "Theme context provider"
                  },
                  "AuthProvider.tsx": {
                    type: "file",
                    description: "Authentication provider"
                  },
                  "Providers.tsx": {
                    type: "file",
                    description: "Combined providers wrapper",
                    important: true
                  }
                }
              }
            }
          },
          "lib/": {
            type: "folder",
            description: "Utility libraries and configurations",
            important: true,
            children: {
              "db.ts": {
                type: "file",
                description: "Database client (Prisma/Drizzle)",
                important: true
              },
              "auth.ts": {
                type: "file",
                description: "NextAuth.js configuration",
                important: true
              },
              "utils.ts": {
                type: "file",
                description: "Utility functions (cn, formatters, etc)"
              },
              "validations.ts": {
                type: "file",
                description: "Zod validation schemas"
              },
              "api-client.ts": {
                type: "file",
                description: "API client configuration (axios/fetch)"
              },
              "constants.ts": {
                type: "file",
                description: "App constants and configs"
              }
            }
          },
          "hooks/": {
            type: "folder",
            description: "Custom React hooks",
            children: {
              "useAuth.ts": {
                type: "file",
                description: "Authentication hook"
              },
              "useChat.ts": {
                type: "file",
                description: "Chat functionality hook"
              },
              "useDebounce.ts": {
                type: "file",
                description: "Debounce hook"
              },
              "useLocalStorage.ts": {
                type: "file",
                description: "localStorage hook"
              },
              "useMediaQuery.ts": {
                type: "file",
                description: "Responsive media query hook"
              }
            }
          },
          "actions/": {
            type: "folder",
            description: "Server Actions (Next.js 14)",
            important: true,
            children: {
              "auth.ts": {
                type: "file",
                description: "Auth server actions (login, register)",
                important: true
              },
              "user.ts": {
                type: "file",
                description: "User management actions"
              },
              "chat.ts": {
                type: "file",
                description: "Chat server actions"
              }
            }
          },
          "types/": {
            type: "folder",
            description: "TypeScript type definitions",
            children: {
              "index.ts": {
                type: "file",
                description: "Global type exports"
              },
              "api.ts": {
                type: "file",
                description: "API response types"
              },
              "auth.ts": {
                type: "file",
                description: "Auth-related types"
              },
              "database.ts": {
                type: "file",
                description: "Database model types"
              }
            }
          },
          "styles/": {
            type: "folder",
            description: "Additional stylesheets",
            children: {
              "variables.css": {
                type: "file",
                description: "CSS custom properties"
              },
              "animations.css": {
                type: "file",
                description: "Custom animations"
              }
            }
          },
          "middleware.ts": {
            type: "file",
            description: "Next.js middleware for auth/redirects",
            important: true
          }
        }
      },
      "public/": {
        type: "folder",
        description: "Static assets",
        children: {
          "images/": {
            type: "folder",
            description: "Image assets",
            children: {
              "logo.svg": {
                type: "file",
                description: "App logo"
              },
              "hero.png": {
                type: "file",
                description: "Hero image"
              }
            }
          },
          "icons/": {
            type: "folder",
            description: "Icon files"
          },
          "favicon.ico": {
            type: "file",
            description: "Favicon"
          }
        }
      },
      "prisma/": {
        type: "folder",
        description: "Prisma ORM configuration",
        important: true,
        children: {
          "schema.prisma": {
            type: "file",
            description: "Database schema definition",
            important: true
          },
          "migrations/": {
            type: "folder",
            description: "Database migration files"
          },
          "seed.ts": {
            type: "file",
            description: "Database seeding script"
          }
        }
      },
      "tests/": {
        type: "folder",
        description: "Test files",
        children: {
          "unit/": {
            type: "folder",
            description: "Unit tests"
          },
          "integration/": {
            type: "folder",
            description: "Integration tests"
          },
          "e2e/": {
            type: "folder",
            description: "End-to-end tests (Playwright)"
          }
        }
      },
      ".env.local": {
        type: "file",
        description: "Local environment variables (gitignored)",
        important: true
      },
      ".env.example": {
        type: "file",
        description: "Environment variables template",
        important: true
      },
      "next.config.js": {
        type: "file",
        description: "Next.js configuration",
        important: true
      },
      "tailwind.config.ts": {
        type: "file",
        description: "Tailwind CSS configuration",
        important: true
      },
      "tsconfig.json": {
        type: "file",
        description: "TypeScript configuration",
        important: true
      },
      "postcss.config.js": {
        type: "file",
        description: "PostCSS configuration"
      },
      "package.json": {
        type: "file",
        description: "NPM dependencies and scripts",
        important: true
      },
      "components.json": {
        type: "file",
        description: "shadcn/ui components config"
      },
      ".eslintrc.json": {
        type: "file",
        description: "ESLint configuration"
      },
      ".prettierrc": {
        type: "file",
        description: "Prettier code formatting config"
      },
      "Dockerfile": {
        type: "file",
        description: "Docker container configuration"
      },
      "docker-compose.yml": {
        type: "file",
        description: "Docker Compose for local dev"
      },
      ".gitignore": {
        type: "file",
        description: "Git ignore rules"
      },
      "README.md": {
        type: "file",
        description: "Project documentation and setup guide",
        important: true
      }
    }
  },

// 8. Vue.js Frontend Starter Kit
8: {
  name: "Vue.js Frontend Starter Kit",
  description: "Production-ready Vue 3 with Composition API, Pinia state management, and Vue Router",
  recommendedFor: {
    product: ["Frontend", "Web App"],
    experience: ["Beginner", "Intermediate"],
    team: ["solo", "2-5"],
    timeline: ["Prototype (Days)", "MVP (Weeks)", "Production (Months)"],
    priorities: ["Fast Setup", "Best Practices", "Learning Friendly"],
    tech: ["Javascript"]
  },

  structure: {

    /* ================= ROOT ================= */

    "index.html": {
      type: "file",
      content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vue Starter</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
      `
    },

    "package.json": {
      type: "file",
      content: `
{
  "name": "vue-starter",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0"
  }
}
      `
    },

    "vite.config.ts": {
      type: "file",
      content: `
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
      `
    },

    "tsconfig.json": {
      type: "file",
      content: `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true
  }
}
      `
    },

    ".env.development": { type: "file", content: "" },
    ".env.production": { type: "file", content: "" },

    "README.md": {
      type: "file",
      content: "# Vue Frontend Starter Kit"
    },

    /* ================= SRC ================= */

    "src/": {
      type: "folder",
      children: {

        "main.ts": {
          type: "file",
          important: true,
          content: `
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
          `
        },

        "App.vue": {
          type: "file",
          content: `
<template>
  <router-view />
</template>

<script setup></script>
          `
        },

        /* ---------- ASSETS ---------- */

        "assets/": {
          type: "folder",
          children: {
            "styles/": {
              type: "folder",
              children: {
                "main.css": {
                  type: "file",
                  content: `
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
                  `
                },
                "variables.css": { type: "file", content: "" }
              }
            },
            "images/": { type: "folder", children: {} }
          }
        },

        /* ---------- ROUTER ---------- */

        "router/": {
          type: "folder",
          children: {
            "index.ts": {
              type: "file",
              important: true,
              content: `
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/:pathMatch(.*)*', component: () => import('../views/NotFound.vue') }
  ]
})
              `
            },
            "guards.ts": { type: "file", content: "" }
          }
        },

        /* ---------- STORES ---------- */

        "stores/": {
          type: "folder",
          children: {
            "index.ts": {
              type: "file",
              content: `
export * from './auth'
              `
            },
            "auth.ts": {
              type: "file",
              content: `
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null })
})
              `
            },
            "user.ts": { type: "file", content: "" },
            "chat.ts": { type: "file", content: "" },
            "app.ts": { type: "file", content: "" }
          }
        },

        /* ---------- VIEWS ---------- */

        "views/": {
          type: "folder",
          children: {
            "Home.vue": {
              type: "file",
              content: `
<template><h1>Home</h1></template>
              `
            },
            "About.vue": { type: "file", content: "" },
            "Dashboard.vue": { type: "file", content: "" },
            "Chat.vue": { type: "file", content: "" },
            "Profile.vue": { type: "file", content: "" },
            "NotFound.vue": {
              type: "file",
              content: `
<template><h1>404</h1></template>
              `
            }
          }
        },

        /* ---------- COMPONENTS (EMPTY SAFE SHELLS) ---------- */

        "components/": {
          type: "folder",
          children: {
            "common/": {
              type: "folder",
              children: {
                "BaseButton.vue": { type: "file", content: "<template><button /></template>" },
                "BaseInput.vue": { type: "file", content: "<template><input /></template>" },
                "BaseCard.vue": { type: "file", content: "<template><div /></template>" },
                "BaseModal.vue": { type: "file", content: "<template><div /></template>" },
                "LoadingSpinner.vue": { type: "file", content: "<template><div>Loading...</div></template>" }
              }
            },
            "layout/": { type: "folder", children: {} },
            "features/": { type: "folder", children: {} }
          }
        },

        /* ---------- REST (EMPTY VALID FILES) ---------- */

        "composables/": { type: "folder", children: {} },
        "services/": { type: "folder", children: {} },
        "utils/": { type: "folder", children: {} },
        "types/": { type: "folder", children: {} },
        "directives/": { type: "folder", children: {} },
        "plugins/": { type: "folder", children: {} }
      }
    },

    "public/": {
      type: "folder",
      children: {
        "favicon.ico": { type: "file", content: "" }
      }
    }
  }
},


// 10. React Native Mobile Starter Kit
   10: {
    name: "React Native Mobile Starter Kit (JS)",
    description: "Minimal React Native JavaScript starter for Android & iOS",
    featured: true,
    githublink:
      "https://github.com/Vikrantthakur64/React_Native_Mobile_Starter_Kit_-JS-.git",

    recommendedFor: {
      product: ["Mobile App"],
      experience: ["Beginner"],
      team: ["solo"],
      timeline: ["Prototype (Days)"],
      priorities: ["Fast Setup"],
      tech: ["JavaScript", "React"],
    },

    structure: {
      "src/": {
        type: "folder",
        children: {
          "App.js": {
            type: "file",
            important: true,
            content: `import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>React Native Starter App</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});`,
          },
        },
      },

      "android/": {
        type: "folder",
        children: {
          "app/": {
            type: "folder",
            children: {
              "build.gradle": {
                type: "file",
                content: `plugins {
  id 'com.android.application'
}

android {
  compileSdk 34
  defaultConfig {
    applicationId 'com.starter.app'
    minSdk 21
    targetSdk 34
    versionCode 1
    versionName '1.0'
  }
}`,
              },
            },
          },
        },
      },

      "ios/": {
        type: "folder",
        children: {
          Podfile: {
            type: "file",
            content: `platform :ios, '13.0'
require_relative '../node_modules/react-native/scripts/react_native_pods'

target 'StarterApp' do
  use_react_native!
end`,
          },
        },
      },

      "package.json": {
        type: "file",
        important: true,
        content: `{
  "name": "react-native-starter",
  "private": true,
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.74.5"
  }
}`,
      },

      "metro.config.js": {
        type: "file",
        content: `const { getDefaultConfig } = require('metro-config');
module.exports = getDefaultConfig(__dirname);`,
      },

      "babel.config.js": {
        type: "file",
        content: `module.exports = {
  presets: ['module:@react-native/babel-preset'],
};`,
      },

      "app.json": {
        type: "file",
        important: true,
        content: `{
  "name": "StarterApp",
  "displayName": "Starter App"
}`,
      },

      "README.md": {
        type: "file",
        important: true,
        content: `# React Native JS Starter

Minimal JavaScript-based React Native project.

## Run

npm install
npm run android
npm run ios`,
      },
    },
  },
// 11. CI/CD Pipeline Starter Kit
  // 11. CI/CD Pipeline Starter Kit
 11: {
  name: "CI/CD Pipeline Starter Kit",
  description:
    "Minimal production-ready CI/CD pipelines for GitHub Actions and Docker",
  featured: false,
  githublink:"https://github.com/Vikrantthakur64/CI-CD_Pipeline_Starter_Kit.git",

  recommendedFor: {
    product: ["CI/CD"],
    experience: ["Beginner", "Intermediate"],
    team: ["solo", "2-5"],
    timeline: [
      "Prototype (Days)",
      "MVP (Weeks)",
      "Production (Months)",
    ],
    priorities: [
      "Fast Setup",
      "Best Practices",
      "Learning Friendly",
    ],
    tech: ["CI/CD"],
  },

  structure: {
    ".github/": {
      type: "folder",
      description: "GitHub Actions workflows",
      children: {
        "workflows/": {
          type: "folder",
          description: "CI/CD pipeline definitions",
          children: {
            "ci.yml": {
              type: "file",
              description: "Continuous Integration - tests & build",
              important: true,
              content: `name: CI Pipeline

on:
  push:
    branches: ["*"]
  pull_request:

jobs:
  build-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test --if-present

      - name: Build application
        run: npm run build --if-present
`,
            },

            "cd.yml": {
              type: "file",
              description: "Continuous Deployment",
              important: true,
              content: `name: CD Pipeline

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t my-app:latest .

      - name: Run Docker container
        run: |
          docker stop my-app || true
          docker rm my-app || true
          docker run -d -p 3000:3000 --name my-app my-app:latest
`,
            },
          },
        },
      },
    },

    "docker/": {
      type: "folder",
      description: "Docker configurations",
      children: {
        "Dockerfile": {
          type: "file",
          description: "Production Docker image",
          important: true,
          content: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
`,
        },

        "docker-compose.yml": {
          type: "file",
          description: "Local development setup",
          important: true,
          content: `version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
`,
        },
      },
    },

    ".gitlab-ci.yml": {
      type: "file",
      description: "GitLab CI pipeline",
      important: true,
      content: `stages:
  - install
  - test

install:
  stage: install
  script:
    - npm install

test:
  stage: test
  script:
    - npm test || true
`,
    },

    Jenkinsfile: {
      type: "file",
      description: "Jenkins pipeline",
      important: true,
      content: `pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || true'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t my-app .'
      }
    }
  }
}
`,
    },

    Makefile: {
      type: "file",
      description: "Common CI/CD tasks",
      important: true,
      content: `install:
	npm install

test:
	npm test

build:
	docker build -t my-app .

run:
	docker run -p 3000:3000 my-app
`,
    },

    "README.md": {
      type: "file",
      description: "CI/CD setup guide",
      important: true,
      content: `# CI/CD Pipeline Starter Kit

## What this kit provides
- GitHub Actions CI & CD
- Docker-based deployment
- GitLab CI support
- Jenkins pipeline
- Makefile for local usage

## CI (Continuous Integration)
Runs on every push and pull request:
- Install dependencies
- Run tests
- Build application

## CD (Continuous Deployment)
Runs on main branch:
- Build Docker image
- Run container

## Local Development
\`\`\`bash
docker-compose up --build
\`\`\`

## Makefile Usage
\`\`\`bash
make install
make test
make build
make run
\`\`\`
`,
    },
  },
}
};