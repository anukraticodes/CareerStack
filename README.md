# CareerStack - Smart File Manager

A comprehensive smart file management system designed for career professionals to organize, manage, and automatically categorize their important documents including certificates, resumes, cover letters, and other career-related files.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [ML Service](#ml-service)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

**CareerStack** is an intelligent file management platform that helps professionals organize their career documents efficiently. The system combines traditional file management with machine learning capabilities to automatically detect and categorize uploaded documents.

Users can securely upload, store, and manage their:
- **Resumes** - Professional CVs and resumes
- **Certificates** - Educational and professional certifications
- **Cover Letters** - Job application cover letters
- **Other Documents** - Additional career-related files

The platform features automatic document detection powered by ML services, eliminating the need for manual categorization.

---

## Key Features

### 🔐 **User Authentication**
- Complete user registration and login system
- Secure session management
- User profile management

### 📁 **Smart File Management**
- Upload multiple file types (PDF, DOC, DOCX, images)
- Organize files by categories
- File metadata tracking (name, size, upload date, owner)
- File preview and download capabilities

### 🤖 **Auto-Detection (ML Service)**
- Automatic document type classification
- Intelligent categorization of uploaded files
- Machine learning-powered content analysis
- Reduces manual sorting effort

### 💻 **Interactive Frontend**
- Modern React-based user interface
- Responsive design for all devices
- Real-time file upload progress
- Intuitive drag-and-drop functionality

### 🗄️ **Robust Backend**
- Java Spring Boot backend (developed in STS)
- RESTful API architecture
- MySQL database integration
- Secure file storage system

---

## Technology Stack

### Backend
- **Java** - Core programming language
- **Spring Boot** - Backend framework
- **Spring Tool Suite (STS)** - Development IDE
- **MySQL** - Database management
- **Maven** - Dependency management

### Frontend
- **React.js** - Frontend framework
- **JavaScript/ES6+** - Programming language
- **HTML5/CSS3** - Markup and styling
- **Axios** - HTTP client for API calls

### ML Service
- **Python** - Machine learning implementation
- **Document Classification Models** - Auto-detection algorithms
- **REST API** - Service communication

### Database
- **MySQL** - Primary database
- **JDBC** - Database connectivity

---

## Prerequisites

Before you begin, ensure you have the following installed:

- [Java JDK 11+](https://www.oracle.com/java/technologies/javase-downloads.html)
- [Spring Tool Suite (STS)](https://spring.io/tools) or [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Node.js (v14+)](https://nodejs.org/en/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- [Python 3.8+](https://www.python.org/downloads/) (for ML service)

---

## Database Setup

### Step 1: Install and Start MySQL Server

Ensure MySQL Server is running locally on port `3306`.

### Step 2: Create the CareerStack Database

1. Open **MySQL Workbench** and connect to your MySQL server.

2. Create the database schema:
   ```sql
   CREATE DATABASE careerstack_db;
   USE careerstack_db;
   ```

### Step 3: Create Database Tables

#### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### File Metadata Table
```sql
CREATE TABLE file_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    detected_category ENUM('resume', 'certificate', 'cover_letter', 'other') DEFAULT 'other',
    mime_type VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    detection_confidence DECIMAL(5,2),
    tags TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_category (detected_category),
    INDEX idx_upload_date (upload_date)
);
```

### Step 4: Insert Sample Data (Optional)

```sql
-- Sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, phone) VALUES
('john_doe', 'john.doe@example.com', '$2a$10$hashedpassword1', 'John', 'Doe', '+1234567890'),
('jane_smith', 'jane.smith@example.com', '$2a$10$hashedpassword2', 'Jane', 'Smith', '+0987654321');

-- Sample file metadata
INSERT INTO file_metadata (user_id, file_name, original_name, file_path, file_size, file_type, detected_category, mime_type, detection_confidence) VALUES
(1, 'resume_001.pdf', 'John_Doe_Resume.pdf', '/uploads/user1/resume_001.pdf', 245760, 'PDF', 'resume', 'application/pdf', 95.50),
(1, 'cert_001.pdf', 'AWS_Certificate.pdf', '/uploads/user1/cert_001.pdf', 156432, 'PDF', 'certificate', 'application/pdf', 88.75),
(2, 'cover_001.docx', 'Cover_Letter_Google.docx', '/uploads/user2/cover_001.docx', 23456, 'DOCX', 'cover_letter', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 92.30);
```

---

## Environment Variables

Create a `.env` file in the project root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=careerstack_db
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=86400000

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# ML Service Configuration
ML_SERVICE_URL=http://localhost:5000
ML_SERVICE_API_KEY=your_ml_service_api_key

# Server Configuration
SERVER_PORT=8080
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

**⚠️ Important:** Never commit your `.env` file to version control.

---

## Project Structure

```
careerstack/
│
├── backend-sts/                 # Java Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/careerstack/
│   │       ├── controller/      # REST Controllers
│   │       ├── service/         # Business Logic
│   │       ├── repository/      # Data Access Layer
│   │       ├── model/           # Entity Classes
│   │       ├── dto/             # Data Transfer Objects
│   │       ├── config/          # Configuration Classes
│   │       └── security/        # Security & JWT
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/              # Static files
│   └── pom.xml                  # Maven dependencies
│
├── frontend/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/          # React Components
│   │   ├── pages/               # Page Components
│   │   ├── services/            # API Services
│   │   ├── utils/               # Utility Functions
│   │   ├── hooks/               # Custom React Hooks
│   │   ├── styles/              # CSS Files
│   │   └── App.js               # Main App Component
│   ├── package.json
│   └── package-lock.json
│
├── ml-service/                  # Python ML Service
│   ├── app.py                   # Flask/FastAPI Application
│   ├── models/                  # ML Models
│   ├── utils/                   # Utility Functions
│   ├── requirements.txt
│   └── Dockerfile               # Container Configuration
│
├── uploads/                     # File Storage Directory
├── docs/                        # Project Documentation
├── .gitignore
├── README.md
└── .env                         # Environment Variables (not committed)
```

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/careerstack.git
cd careerstack
```

### 2. Backend Setup (Java Spring Boot)
```bash
cd backend-sts

# If using Maven wrapper
./mvnw clean install

# Or if Maven is installed globally
mvn clean install
```

### 3. Frontend Setup (React)
```bash
cd ../frontend
npm install
```

### 4. ML Service Setup (Python)
```bash
cd ../ml-service
pip install -r requirements.txt
```

---

## Running the Project

### 1. Start the Backend Server
```bash
cd backend-sts

# Using Maven wrapper
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run

# Or run the JAR file directly
java -jar target/careerstack-backend-0.0.1-SNAPSHOT.jar
```
Backend will start on `http://localhost:8080`

### 2. Start the ML Service
```bash
cd ml-service
python app.py
```
ML Service will start on `http://localhost:5000`

### 3. Start the Frontend
```bash
cd frontend
npm start
```
Frontend will start on `http://localhost:3000`

### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### File Management
- `GET /api/files` - Get user's files
- `POST /api/files/upload` - Upload new file
- `GET /api/files/{id}` - Get specific file details
- `DELETE /api/files/{id}` - Delete file
- `GET /api/files/{id}/download` - Download file
- `PUT /api/files/{id}/category` - Update file category

### ML Detection
- `POST /api/ml/detect` - Auto-detect file type
- `GET /api/ml/categories` - Get available categories

---

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique user identifier |
| username | VARCHAR(50) | Unique username |
| email | VARCHAR(100) | User email address |
| password_hash | VARCHAR(255) | Encrypted password |
| first_name | VARCHAR(50) | User's first name |
| last_name | VARCHAR(50) | User's last name |
| phone | VARCHAR(15) | Phone number |
| created_at | TIMESTAMP | Account creation date |
| updated_at | TIMESTAMP | Last profile update |
| is_active | BOOLEAN | Account status |

### File Metadata Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT (PK) | Unique file identifier |
| user_id | INT (FK) | Owner of the file |
| file_name | VARCHAR(255) | System file name |
| original_name | VARCHAR(255) | Original upload name |
| file_path | VARCHAR(500) | File storage path |
| file_size | BIGINT | File size in bytes |
| file_type | VARCHAR(50) | File extension |
| detected_category | ENUM | Auto-detected category |
| mime_type | VARCHAR(100) | MIME type |
| upload_date | TIMESTAMP | Upload timestamp |
| last_accessed | TIMESTAMP | Last access time |
| is_deleted | BOOLEAN | Soft delete flag |
| detection_confidence | DECIMAL(5,2) | ML confidence score |
| tags | TEXT | User-defined tags |

---

## ML Service

The ML service provides automatic document classification capabilities:

### Features
- Document type detection (resume, certificate, cover letter)
- Content analysis and categorization
- Confidence scoring for predictions
- Support for multiple file formats

### Supported File Types
- PDF documents
- Microsoft Word (DOC, DOCX)
- Plain text files
- Image files with OCR capabilities

---

## Testing

### Backend Testing
```bash
cd backend-sts
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use tools like Postman or curl to test API endpoints:
```bash
# Test user registration
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

---

## Contributing

We welcome contributions to CareerStack! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow Java naming conventions for backend code
- Use ESLint and Prettier for frontend code formatting
- Write meaningful commit messages
- Include tests for new features

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/careerstack/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

## Acknowledgments

- Spring Boot community for excellent documentation
- React.js team for the fantastic frontend framework
- MySQL for reliable database management
- All contributors who help improve CareerStack

---

**Happy file managing with CareerStack! 🚀**
