from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db import db, cursor

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins. Replace with specific domains if needed.
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Pydantic model for book data
class Book(BaseModel):
    title: str
    author: str
    isbn: str

@app.get("/")
def home():
    return {"message": "Welcome to Library Management API"}

# Endpoint to fetch all books

@app.get("/books/")
def get_books():
    cursor.execute("SELECT * FROM Books")
    books = cursor.fetchall()
    return {"books": [dict(zip(["BookID", "Title", "Author", "ISBN"], row)) for row in books]}

# Endpoint to add a new book
@app.post("/books/")
def create_book(book: Book):
    cursor.execute(
        "INSERT INTO Books (Title, Author, ISBN) VALUES (%s, %s, %s)",
        (book.title, book.author, book.isbn)
    )
    db.commit()
    return {"message": "Book added successfully"}

# Endpoint to update a book
@app.put("/books/{book_id}")
def update_book(book_id: int, book: Book):
    cursor.execute(
        "UPDATE Books SET Title=%s, Author=%s, ISBN=%s WHERE BookID=%s",
        (book.title, book.author, book.isbn, book_id)
    )
    db.commit()
    return {"message": "Book updated successfully"}

# Endpoint to delete a book
@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    cursor.execute("DELETE FROM Books WHERE BookID=%s", (book_id,))
    db.commit()
    return {"message": "Book deleted successfully"}