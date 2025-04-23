# 🧠 Local RAG Assistant

The **Local RAG (Retrieval-Augmented Generation) Assistant** is a full-stack, privacy-friendly AI assistant that runs entirely on your machine. It allows users to upload files, perform semantic search over their content, and interact with a locally hosted LLM for contextual Q&A.

---

### 🗂️ Project Structure

This project is divided into two parts:

```bash
Local-RAG-Assistant/
├── rag-backend/       # Backend setup
│   └── README.md      # 📘 Backend setup and usage instructions
├── rag-frontend/      # Frontend: React + Vite + Tailwind CSS
│   └── README.md      # 📘 Frontend setup
└── README.md          # 📍 This file (overall summary)
```

###  Clone the Repo

```bash
git clone https://github.com/Vikhram5/Local-RAG-Assistant.git
cd Local-RAG-Assistant
```


```bash
Each folder includes its own `README.md` with detailed setup instructions, dependencies, and usage.
Navigate to the `rag-backend` and `rag-frontend` respectively to run each of the files.
```

## ⚡ Performance

- **Speed**: Fast for medium-sized PDFs. Chroma + HuggingFace embeddings are efficient. Ollama inference speed depends on local setup.
- **Bottlenecks**:
  - Initial PDF processing (text extraction + embedding)
  - LLM response generation (depending on hardware)
- **Optimizations**:
  - Persistent indexing instead of re-creating on every upload
  - Background tasking for long-running operations

## 🧩 Future Improvements

- Add persistent Chroma storage
- Add more efficient methods of retrieving content for larger pdfs
- Implement user session-based indexing and integrate memory module