
from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz 
import os
import ollama
import chromadb
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
from langchain.text_splitter import RecursiveCharacterTextSplitter
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://192.168.0.101:5173","http://10.11.159.126:5173"]}})

#---------------------------------------Upload PDF--------------------------------------------------#

@app.route("/upload", methods=["POST"])
def upload_pdf():
    """Handle PDF uploads and store embeddings."""
    file = request.files.get("file")
    if file:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        
        # Process the PDF and store the index
        global index
        index = process_pdf(file_path)

        return jsonify({"message": "PDF processed successfully!"}), 200
    return jsonify({"error": "No file received"}), 400


#---------------------------------------Initialization--------------------------------------------------#

UPLOAD_FOLDER = "data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

#disable model
Settings.llm = None

client = chromadb.Client()

embed_model = HuggingFaceEmbedding(model_name="sentence-transformers/all-MiniLM-L6-v2")
chroma_collection = client.create_collection("pdf_collection")

# Create ChromaVectorStore and storage context
vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
storage_context = StorageContext.from_defaults(vector_store=vector_store)

index = None


#---------------------------------------Extract Text from PDF--------------------------------------------------#

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        # Extract text with block-level structure
        blocks = page.get_text("blocks")
        for block in blocks:
            text += block[4] + "\n"  
    return text


#---------------------------------------Process PDF--------------------------------------------------#

def process_pdf(pdf_path):
    global index
    text = extract_text_from_pdf(pdf_path)

    # Split text into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1024,  # 512-1024 - better context
        chunk_overlap=128,  # Retains overlapping context
        separators=["\n\n", ". ", "?", "!"]  # Split intelligently on sentences/paragraphs
    )

    chunks = text_splitter.split_text(text)

    # Save chunks into a directory for indexing
    os.makedirs("chunks", exist_ok=True)
    for i, chunk in enumerate(chunks):
        with open(f"chunks/chunk_{i}.txt", "w") as f:
            f.write(chunk)

    # Use SimpleDirectoryReader to read the chunks
    reader = SimpleDirectoryReader('chunks')
    documents = reader.load_data()

    # Create the index using VectorStoreIndex with correct settings and storage context
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        embed_model=embed_model  # Pass the embedding model here
    )

    return index



#---------------------------------------Respond to questions--------------------------------------------------#

@app.route("/ask", methods=["POST"])
def ask_question():
    global index
    if index is None:
        return jsonify({"error": "No PDF uploaded yet!"}), 400

    data = request.get_json()
    query = data.get("question")

    if not query:
        return jsonify({"error": "No question provided"}), 400

    query_engine = index.as_query_engine(similarity_top_k=5)
    response = query_engine.query(query)

    #enter the model you are using 
    try:
        ollama_response = ollama.chat(model="llama3.2", messages=[
            {"role": "system", "content": "You are a helpful teaching assistant."},
            {"role": "user", "content": f"""Analyse properly and answer the following question with the help of the context:\n{response}\n\nQuestion: {query}\n Provide a formatted and relevant response."""}
        ])
        
        answer = ollama_response.get("message", {}).get("content", "No valid response from model.")
        formatted_answer = format_answer(answer)

    except Exception as e:
        return jsonify({"error": f"Error in Ollama API: {str(e)}"}), 500
    print(formatted_answer)

    return jsonify({"answer": formatted_answer})

#---------------------------------------format answer--------------------------------------------------#

def format_answer(answer):
    """Format the answer to make it more readable and structured."""
    
    answer = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', answer)
    answer = answer.replace("\n", "<br>")
    
    answer = re.sub(r'```(.*?)```', r'<pre><code>\1</code></pre>', answer, flags=re.DOTALL)
    answer = re.sub(r'`([^`]+)`', r'<code>\1</code>', answer)  # Inline code

    answer = re.sub(r'([A-Z][A-Za-z\s]+):', r'<h3>\1</h3>', answer)
    answer = re.sub(r'^\* (.+)$', r'<li>\1</li>', answer, flags=re.MULTILINE)
    
    answer = re.sub(r'(<li>.*?</li>(?:<br>)?)+', r'<ul>\g<0></ul>', answer, flags=re.DOTALL)
    answer = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', answer)
    answer = re.sub(r'### Question (\d+)', r'<h3>Question \1</h3>', answer)
    answer = re.sub(r'### Answer', r'<h4>Answer</h4>', answer)
    
    answer = answer.replace('\n', '<br>')
    answer = re.sub(r'([A-Da-d])\)', r'<br><strong>\1)</strong>', answer)

    answer = re.sub(r'\$(.*?)\$', r'\$begin:math:text$\\1\\$end:math:text$', answer)  
    answer = re.sub(r'\$\$(.*?)\$\$', r'\$begin:math:display$\\1\\$end:math:display$', answer, flags=re.DOTALL) 
    
    formatted = f'<div class="formatted-answer">{answer}</div>'

    return f'<div>{answer}</div>'

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)


#Vikhram