# 🧠 Local RAG Assistant

The **Local RAG (Retrieval-Augmented Generation) Assistant** is a full-stack, privacy-friendly AI assistant that runs entirely on your machine. It allows users to upload files, perform semantic search over their content, and interact with a locally hosted LLM for contextual Q&A.

---

## 🗂️ Project Structure

This project is divided into two parts:

## Local-RAG-Assistant/
# ├── rag-backend/     # Backend setup
# │   └── README.md    # 📘 Backend setup and usage instructions
# ├── rag-frontend/    # Frontend: React + Vite + Tailwind CSS
# │   └── README.md    # 📘 Frontend setup
# └── README.md        # 📍 This file (overall summary)

###  Clone the Repo

```bash
git clone https://github.com/Vikhram5/Local-RAG-Assistant.git
cd Local-RAG-Assistant
```

### Each folder includes its own `README.md` with detailed setup instructions, dependencies, and usage.
### Navigate to the `rag-backend` and `rag-frontend` respectively to run each of the files.

## ✨ Features

### 🔍 Backend (Flask + LangChain + Ollama + Qdrant)
- 🧠 RAG pipeline with local LLM (LLaMA via Ollama)
- 📄 PDF/Text file ingestion and chunking
- 📚 Embedding and vector search using Qdrant
- 🔗 LangChain integration for document retrievers and prompt chains
- 🖥️ All components run locally – No cloud dependency

### 🖥️ Frontend (React + Vite)
- 📂 File upload via Sidebar
- 💬 Chat interface for Q&A
- ✅ React hooks for file and upload state
- 🎨 Tailwind CSS for responsive design

---


