
# 📘 AI-Powered Local RAG Edu-Assistant Backend

This project is a Flask-based API that allows users to upload PDFs, process them into chunks, store embeddings using ChromaDB, and ask questions based on the content using LLaMA 3.2 via Ollama and sentence embeddings via HuggingFace locally in the system.

## 🚀 Features

- Upload and extract text from PDF documents.
- Split and embed text chunks using `sentence-transformers/all-MiniLM-L6-v2`.
- Store embeddings in **Chroma** vector store.
- Query document content using semantic similarity.
- Format AI-generated answers with HTML for frontend display.


## 🧠 How It Works

1. **PDF Upload**  
   Upload a PDF via POST request to `/upload`. It extracts and chunks the text, embeds it, and stores it using ChromaDB.

2. **Ask Questions**  
   Send a POST request to `/ask` with a question. The backend:
   - Queries the Chroma vector index.
   - Sends the top-k context chunks to Ollama.
   - Returns a formatted HTML answer.

## 📦 Setup & Run

### 1. Run the backend

```bash
cd rag-backend
```

### 2. Create a virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```


### 3. Run the Server

```bash
python app.py
```

Server will start at:  
`http://localhost:5001`

### 4. Run the model

```bash
ollama run llama3.2
```

<!-- ## 🛠️ Technologies Used

- **Flask** – Backend API framework
- **PyMuPDF (fitz)** – PDF parsing
- **LlamaIndex** – Vector index management
- **HuggingFace Transformers** – Sentence embeddings
- **ChromaDB** – Lightweight vector store
- **Ollama** – LLM model host (LLaMA 3.2)
- **LangChain**  -->


## 📒 Advantages of Local RAG Assistant

  - Offline Access: Works without internet once set up.
  - Privacy First: Your files and questions never leave your device.
	- Fast Responses: Local model + local search = quick answers.
	- Custom Knowledge: Ask questions from your own documents.
	- No API Costs: No need to pay for external APIs.
	- Flexible & Customizable: Swap models, update features anytime.
	- Great for Learning: Ideal for students, teachers, and researchers.

