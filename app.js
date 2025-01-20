const express = require('express');
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
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
  { id: 2, title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" }
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

// Route for book details
app.get('/book/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).render('404');
  res.render('book-details', { book: book });
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

