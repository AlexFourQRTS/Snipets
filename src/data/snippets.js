export const snippetsData = [
  {
    id: 1,
    title: 'Fast API User Auth (Python)',
    language: 'Code',
    date: '2025-10-28',
    views: '1.9k',
    tags: [],
    category: 'Backend',
    code: `# main.py - User Authentication Endpoint
from fastapi import FastAPI
from pydantic import BaseModel

class User(BaseModel):
    username: str
    password: str

app = FastAPI()

@app.post("/token")
def login(user: User):
    # Проверка логина/пароля в БД
    if user.username == "admin" and user.password == "secret":
        return {"token": "fake_jwt_token"}
    return {"message": "Invalid credentials"}`,
    notes: `**Implementation Details:**

- Uses bcrypt for password hashing (not shown).
- Integrated with SQLAlchemy ORM.
- See [FastAPI Auth Tutorial](link-to-tutorial) for full guide.

Used for the initial POC. Must be updated to use OAuth2 standard flow.`
  },
  {
    id: 2,
    title: 'SQL Table Schema (MySQL)',
    language: 'Code',
    date: '2025-10-28',
    views: '12',
    tags: [],
    category: 'Database',
    code: `CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);`,
    notes: `**Database Schema for User Management:**

- Primary key with auto-increment
- Unique constraints on username and email
- Password hash storage (not plain text)
- Timestamps for audit trail
- Indexes for performance optimization`
  },
  {
    id: 3,
    title: 'React EuiFilter Hook',
    language: 'Code',
    date: '2025-10-28',
    views: '45',
    tags: [],
    category: 'Frontend',
    code: `import { useState, useCallback } from 'react';

export const useFilter = (initialItems = []) => {
  const [items, setItems] = useState(initialItems);
  const [filters, setFilters] = useState({});

  const applyFilter = useCallback((newFilters) => {
    setFilters(newFilters);
    
    const filtered = initialItems.filter(item => {
      return Object.entries(newFilters).every(([key, value]) => {
        if (!value) return true;
        return item[key]?.toLowerCase().includes(value.toLowerCase());
      });
    });
    
    setItems(filtered);
  }, [initialItems]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setItems(initialItems);
  }, [initialItems]);

  return {
    items,
    filters,
    applyFilter,
    clearFilters
  };
};`,
    notes: `**Custom React Hook for Filtering:**

- Reusable filter logic
- Supports multiple filter criteria
- Optimized with useCallback
- Easy to integrate with any component
- Returns filtered items and filter controls`
  },
  {
    id: 4,
    title: 'Node.js File Upload Stream',
    language: 'Code',
    date: '2025-10-28',
    views: '80',
    tags: [],
    category: 'Backend',
    code: `const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});`,
    notes: `**File Upload Configuration:**

- Multer middleware for file handling
- Custom storage with unique filenames
- File type validation
- Size limits for security
- Automatic directory creation
- Error handling for invalid files`
  },
  {
    id: 5,
    title: 'QuickSort (JS)',
    language: 'Code',
    date: '2025-09-01',
    views: '2.1k',
    tags: [],
    category: 'Algorithms',
    code: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Example usage
const numbers = [64, 34, 25, 12, 22, 11, 90];
console.log('Original:', numbers);
console.log('Sorted:', quickSort(numbers));`,
    notes: `**QuickSort Implementation:**

- Divide and conquer algorithm
- Average time complexity: O(n log n)
- Worst case: O(n²)
- In-place sorting (memory efficient)
- Recursive implementation
- Works with any comparable data types`
  }
];

