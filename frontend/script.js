const API_URL = "http://127.0.0.1:8000";
let allBooks = [];

// Fetch and display books
async function fetchBooks(query = "") {
  const loadingMessage = document.getElementById("loadingMessage");
  const bookList = document.getElementById("bookList");
  try {
    loadingMessage.style.display = "block";
    bookList.innerHTML = ""; // Clear the list
    const response = await fetch(`${API_URL}/books/`);
    if (!response.ok) throw new Error("Failed to fetch books");
    allBooks = await response.json();

    const filteredBooks = query
      ? allBooks.filter(book =>
          [book.Title, book.Author, book.ISBN].some(field =>
            field.toLowerCase().includes(query)
          )
        )
      : allBooks;

    renderBooks(filteredBooks);
  } catch (error) {
    bookList.innerHTML = `<li>Error: ${error.message}</li>`;
  } finally {
    loadingMessage.style.display = "none";
  }
}

// Render books in the "Available Books" section
function renderBooks(books) {
  const bookList = document.getElementById("bookList");
  bookList.innerHTML = ""; // Clear the list

  if (books.length === 0) {
    bookList.innerHTML = "<li>No books found</li>";
    return;
  }

  books.forEach(book => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${book.Title}</strong> by ${book.Author} (ISBN: ${book.ISBN})
      <span>
        <button class="edit-btn" data-id="${book.BookID}">Edit</button>
        <button class="delete-btn" data-id="${book.BookID}">Delete</button>
      </span>
    `;
    bookList.appendChild(li);
  });
}

// Add a new book
async function addBook(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  await fetch(`${API_URL}/books/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, isbn })
  });

  fetchBooks();
  alert("Book added successfully!");
  document.getElementById("addBookForm").reset();
}

// Delete a book
async function deleteBook(bookId) {
  await fetch(`${API_URL}/books/${bookId}`, { method: "DELETE" });
  fetchBooks();
  alert("Book deleted successfully!");
}

// Edit a book
async function editBook(bookId) {
  const book = allBooks.find(b => b.BookID == bookId);
  const newTitle = prompt("Edit Title:", book.Title);
  const newAuthor = prompt("Edit Author:", book.Author);
  const newISBN = prompt("Edit ISBN:", book.ISBN);
  if (newTitle && newAuthor && newISBN) {
    await fetch(`${API_URL}/books/${bookId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, author: newAuthor, isbn: newISBN })
    });
    fetchBooks();
    alert("Book updated successfully!");
  }
}

// Event listeners
document.getElementById("addBookForm").addEventListener("submit", addBook);

document.getElementById("bookList").addEventListener("click", function (e) {
  const id = e.target.getAttribute("data-id");
  if (e.target.classList.contains("delete-btn")) deleteBook(id);
  if (e.target.classList.contains("edit-btn")) editBook(id);
});

document.getElementById("submitSearch").addEventListener("click", function () {
  const query = document.getElementById("searchInput").value.toLowerCase();
  fetchBooks(query);
});

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  fetchBooks(query);
});

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  alert(`Thank you, ${name}! Your message has been received.`);
  document.getElementById("contactForm").reset();
});

// Load books on page load
document.addEventListener("DOMContentLoaded", () => fetchBooks());