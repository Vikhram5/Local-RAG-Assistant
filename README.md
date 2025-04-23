
# 📘 AI-Powered PDF Question Answering API

This project is a Flask-based API that allows users to upload PDFs, process them into chunks, store embeddings using ChromaDB, and ask questions based on the content using LLaMA 3.2 via Ollama and sentence embeddings via HuggingFace.

## 🚀 Features

- Upload and extract text from PDF documents.
- Split and embed text chunks using `sentence-transformers/all-MiniLM-L6-v2`.
- Store embeddings in **Chroma** vector store.
- Query document content using semantic similarity.
- Format AI-generated answers with HTML for frontend display.
- Cross-Origin Resource Sharing (CORS) enabled for frontend development.

## 🛠️ Technologies Used

- **Flask** – Backend API framework
- **PyMuPDF (fitz)** – PDF parsing
- **LlamaIndex** – Vector index management
- **HuggingFace Transformers** – Sentence embeddings
- **ChromaDB** – Lightweight vector store
- **Ollama** – LLM model host (LLaMA 3.2)
- **LangChain** – Text splitting
- **OpenAI** – For API key registration (if expanded)

## 🧠 How It Works

1. **PDF Upload**  
   Upload a PDF via POST request to `/upload`. It extracts and chunks the text, embeds it, and stores it using ChromaDB.

2. **Ask Questions**  
   Send a POST request to `/ask` with a question. The backend:
   - Queries the Chroma vector index.
   - Sends the top-k context chunks to Ollama.
   - Returns a formatted HTML answer.

## 📦 Setup & Run

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/pdf-ai-qa-api.git
cd pdf-ai-qa-api
```

### 2. Install Requirements

```bash
pip install -r requirements.txt
```

Example `requirements.txt`:
```
flask
flask-cors
PyMuPDF
llama-index
chromadb
sentence-transformers
langchain
openai
```

### 3. Set Environment Variables

Set your OpenAI key if needed:
```bash
export OPENAI_API_KEY="your_openai_key"
```

### 4. Run the Server

```bash
python app.py
```

Server will start at:  
`http://localhost:5001`

## 📡 API Endpoints

### `POST /upload`
**Request**: Multipart Form with `file=<PDF File>`  
**Response**: JSON

```json
{
  "message": "PDF processed successfully!"
}
```

### `POST /ask`
**Request Body** (JSON):

```json
{
  "question": "What is the main topic of Chapter 3?"
}
```

**Response** (Formatted HTML in JSON):

```json
{
  "answer": "<div><h3>Chapter 3:</h3><br>...</div>"
}
```

## ⚡ Performance

- **Speed**: Fast for small to medium PDFs (1–50 pages). Chroma + HuggingFace embeddings are efficient. Ollama inference speed depends on local setup.
- **Bottlenecks**:
  - Initial PDF processing (text extraction + embedding)
  - Ollama LLM response generation (depending on hardware)
- **Optimizations**:
  - Persistent indexing instead of re-creating on every upload
  - Background tasking for long-running operations
  - Use `llama-cpp` for even faster local inference (if needed)

## 🧩 Future Improvements

- Add persistent Chroma storage
- Implement user session-based indexing
- Add PDF title or metadata handling
- Enhance UI with answer highlighting and voice output (TTS)
