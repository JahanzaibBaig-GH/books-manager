const Book = require("../models/Book");
const validateBook = require("../utils/validation");

/*========================================
* Utility function to handle async errors
=========================================*/
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/*================================
* Create a book (POST)
=================================*/
const createBook = asyncHandler(async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const existingBook = await Book.findOne({ isbn: req.body.isbn });
  if (existingBook) {
    return res.status(409).json({ message: "ISBN already exists" });
  }

  const book = new Book(req.body);
  await book.save();
  res.status(201).json(book);
});

/*================================
* Update a book by ID (PUT)
=================================*/
const updateBook = asyncHandler(async (req, res) => {
  const { _id, __v, ...updateData } = req.body;

  const { error } = validateBook(updateData);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const existingBook = await Book.findById(req.params.id);
  if (!existingBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (updateData.isbn && updateData.isbn !== existingBook.isbn) {
    const isbnExists = await Book.findOne({
      isbn: updateData.isbn,
      _id: { $ne: req.params.id },
    });
    if (isbnExists) {
      return res.status(409).json({ message: "ISBN already exists" });
    }
  }

  const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.status(200).json(book);
});

/*================================
* Get all books
=================================*/
const getAllBooks = asyncHandler(async (req, res) => {
  const {
    search,
    author,
    title,
    isbn,
    publishedYear,
    page = 1,
    limit = 10,
    sortBy = "title",
    order = "asc",
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  let filterQuery = {};

  if (search) {
    filterQuery.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { isbn: { $regex: search, $options: "i" } },
    ];
    if (!isNaN(search)) {
      filterQuery.$or.push({ publishedYear: parseInt(search, 10) });
    }
  }

  if (author) filterQuery.author = { $regex: author, $options: "i" };
  if (title) filterQuery.title = { $regex: title, $options: "i" };
  if (isbn) filterQuery.isbn = isbn;
  if (publishedYear && !isNaN(publishedYear)) {
    filterQuery.publishedYear = parseInt(publishedYear, 10);
  }

  const sortOptions = { [sortBy]: order === "desc" ? -1 : 1 };

  const [books, totalBooks] = await Promise.all([
    Book.find(filterQuery).sort(sortOptions).skip(skip).limit(limitNumber),
    Book.countDocuments(filterQuery),
  ]);

  res.json({
    totalBooks,
    totalPages: Math.ceil(totalBooks / limitNumber),
    currentPage: pageNumber,
    books,
  });
});

/*================================
* Get a single book by ID
=================================*/
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

/*================================
* Delete a book by ID
=================================*/
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json({ message: "Book deleted successfully" });
});

/*================================
* Export handlers
=================================*/
module.exports = {
  createBook,
  updateBook,
  getAllBooks,
  getBookById,
  deleteBook,
};
