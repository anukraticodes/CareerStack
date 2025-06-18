from flask import Flask, request, jsonify
import filetype
import os
from flask_cors import CORS
from PyPDF2 import PdfReader
import docx

app = Flask(__name__)

CORS(app)


def extract_text(file_path):
    """Extract text from PDF or DOCX files."""
    if file_path.endswith('.pdf'):
        try:
            reader = PdfReader(file_path)
            return " ".join(page.extract_text() for page in reader.pages)
        except Exception as e:
            print(f"Error extracting text from PDF: {e}")
            return None
    elif file_path.endswith('.docx'):
        try:
            doc = docx.Document(file_path)
            return " ".join(para.text for para in doc.paragraphs)
        except Exception as e:
            print(f"Error extracting text from DOCX: {e}")
            return None
    else:
        return None


def categorize_file(text):
    """Categorize the file based on its content."""
    if not text:
        return "unknown"

    text_lower = text.lower()

    if any(keyword in text_lower for keyword in ["resume", "curriculum vitae", "experience", "skills", "education", "objective"]):
        return "resume"
    elif any(keyword in text_lower for keyword in ["certificate", "certified", "successfully completed", "awarded", "training"]):
        return "certificate"
    elif any(keyword in text_lower for keyword in ["cover letter", "application letter", "dear hiring", "position", "i am writing"]):
        return "cover letter"
    else:
        return "other"



@app.route('/detect', methods=['POST'])
def detect_file_type():
    """Detect file type and categorize it."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    uploaded_file = request.files['file']
    temp_path = os.path.join('temp_upload', uploaded_file.filename)

    # Save the uploaded file temporarily
    os.makedirs('temp_upload', exist_ok=True)
    uploaded_file.save(temp_path)

    # Detect MIME type and extension
    kind = filetype.guess(temp_path)
    mime_type = kind.mime if kind else "unknown"
    extension = kind.extension if kind else "unknown"

    # Extract text and categorize
    text = extract_text(temp_path) if kind and mime_type in ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] else None
    category = categorize_file(text)

    # Clean up the temporary file
    os.remove(temp_path)

    return jsonify({
        'type': mime_type,
        'extension': extension,
        'category': category
    }), 200


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)

