const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set up Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Sample data
const books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", isbn: "1435132416"},
  { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction", isbn: "0452262933"},
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance", isbn: "0141439513" }
];

const authors = [
  { id: 1, name: "Harper Lee", birthYear: 1926, nationality: "American" },
  { id: 2, name: "George Orwell", birthYear: 1903, nationality: "British" },
  { id: 3, name: "Jane Austen", birthYear: 1775, nationality: "British" }
];

// Route for home page (list view)
app.get('/', (req, res) => {
  res.render('home', { books: books });
});

// Route for book details with cover and more details
app.get('/book/:id', async (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).render('404');

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
    const resBookDetails = response.data.items && response.data.items.length > 0 ? response.data.items[0].volumeInfo : null;
    const bookDetails = {
      pageCount: resBookDetails.pageCount,
      description: resBookDetails.description,
      isbn: resBookDetails.industryIdentifiers ? resBookDetails.industryIdentifiers[0].identifier : book.isbn,
      image: resBookDetails.imageLinks ? resBookDetails.imageLinks.thumbnail : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTMI5yf9vYw85Q9Qr4kI3HH-qHdza7Gzp5HQ&s"
    };
    res.render('book-details', { book: book, additionalDetails: bookDetails});
  } catch (error) {
    console.error(error);
    res.render('book-details', { book: book, bookDetails: null, coverImage: null });
  }
});

// Route for add book page (form)
app.get('/add-book', (req, res) => {
  res.render('add-book');
});

// Route to handle adding a new book
app.post('/add-book', (req, res) => {
  const newBook = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    year: parseInt(req.body.year),
    genre: req.body.genre
  };
  books.push(newBook);
  res.redirect('/');
});

// Route for authors page (table view)
app.get('/authors', (req, res) => {
  res.render('authors', { authors: authors });
});

// Start the server
app.listen(port, () => {
  console.log(`Book Library app listening at http://localhost:${port}`);
});

