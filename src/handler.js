/* eslint-disable no-unused-vars */
const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let res;

  if (!name) {
    res = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    res.code(400);
  } else if (readPage > pageCount) {
    res = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    res.code(400);
  } else {
    books.push({
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished: pageCount === readPage,
      insertedAt,
      updatedAt,
    });

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      res = h.response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      });
      res.code(201);
    } else {
      res = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
      });
      res.code(500);
    }
  }
  return res;
};

const allBooksHandler = (req, h) => {
  const category = Object.keys(req.query);
  const { name } = req.query;
  if (name) {
    const chosenBooks = books.filter((book) =>
      book.name.toLowerCase().trim().includes(name.toLowerCase().trim())
    );
    const res = h.response({
      status: "success",
      data: {
        books: chosenBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }
  // Thanks dicoding team, I forgot that empty array and object is truthy
  // before is, if (req.query)
  if (category.length > 0) {
    req.query[category] = parseInt(req.query[category], 2) === 1;
    const readingBooks = books.filter(
      (book) => book[category] === req.query[category]
    );
    const res = h.response({
      status: "success",
      data: {
        books: readingBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    res.code(200);
    return res;
  }

  const renderedBooks =
    books.length > 0
      ? books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }))
      : [];
  const res = h.response({
    status: "success",
    data: {
      books: renderedBooks,
    },
  });
  res.code(200);
  return res;
};

const detailBookHandler = (req, h) => {
  const { bookId } = req.params;
  const bookTarget = books.filter((book) => book.id === bookId);
  let res;
  if (!bookTarget.length > 0) {
    res = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    res.code(404);
  } else {
    res = h.response({
      status: "success",
      data: { book: bookTarget[0] },
    });
    res.code(200);
  }
  return res;
};

const updateBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;
  const { bookId } = req.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  let res;
  if (!name) {
    res = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    res.code(400);
  } else if (readPage > pageCount) {
    res = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    res.code(400);
  } else if (bookIndex === -1) {
    res = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    res.code(404);
  } else {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };
    res = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    res.code(200);
  }
  return res;
};

const deleteBookHandler = (req, h) => {
  const { bookId } = req.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);
  let res;
  if (bookIndex === -1) {
    res = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    res.code(404);
  } else {
    books.splice(bookIndex, 1);
    res = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    res.code(200);
  }
  return res;
};

module.exports = {
  addBookHandler,
  allBooksHandler,
  detailBookHandler,
  updateBookHandler,
  deleteBookHandler,
};
