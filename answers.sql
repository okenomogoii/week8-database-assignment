CREATE DATABASE LibraryDB;
USE LibraryDB;

-- Books Table
CREATE TABLE Books (
    BookID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(20) UNIQUE NOT NULL,
    Available BOOLEAN DEFAULT TRUE
);

-- Members Table
CREATE TABLE Members (
    MemberID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Phone VARCHAR(15) UNIQUE NOT NULL,
    JoinDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

   -- Loans Table
CREATE TABLE Loans (
    LoanID INT PRIMARY KEY AUTO_INCREMENT,
    MemberID INT,
    BookID INT,
    LoanDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ReturnDate DATE,
    FOREIGN KEY (MemberID) REFERENCES Members(MemberID),
    FOREIGN KEY (BookID) REFERENCES Books(BookID)
);

INSERT INTO Books (Title, Author, ISBN) VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565'),
('1984', 'George Orwell', '9780451524935'),
('To Kill a Mockingbird', 'Harper Lee', '9780061120084');

INSERT INTO Members (Name, Email, Phone) VALUES 
('Alice Johnson', 'alice@gmail.com', '0744543534'),
('Bob Smith', 'bob@gmail.com', '0711992233');

INSERT INTO Loans (MemberID, BookID, LoanDate) VALUES 
(1, 2, '2025-05-01'),
(2, 3, '2025-05-03');
