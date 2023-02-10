const express = require("express");
const { ObjectId } = require("mongodb");
const { connectToDb, getDb } = require("./db");

// initialize the app and middleware

const app = express();
app.use(express.json());

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("app listening on PORT 3000");
    });
    db = getDb();
  }
});

// routes
app.get("/books", async (req, res) => {
  const page = req.query.page || 0;
  const booksPerPage = 3;

  let books = [];

  try {
    // mongodb's default batch size is 101 documents
    await db
      .collection("books")
      .find()
      .sort({ author: 1 })
      .skip(page * booksPerPage)
      .limit(booksPerPage)
      .forEach((book) => books.push(book)); // returns a cursor (a pointer to the documents). need to specify toArray or forEach
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch the documents" });
  }
});

app.get("/books/:id", async (req, res) => {
  id = req.params.id;
  //   check to see if the string id is valid
  if (ObjectId.isValid(id)) {
    try {
      const response = await db
        .collection("books")
        .findOne({ _id: new ObjectId(id) });
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "book id does not exist" });
    }
  } else {
    res.status(500).json({ error: "the document id is not valid" });
  }
});

app.post("/books", async (req, res) => {
  const book = req.body;
  try {
    const response = await db.collection("books").insertOne(book);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "could not create a new document" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const id = req.params.id;
  //   check to see if the string id is valid
  if (ObjectId.isValid(id)) {
    try {
      const response = await db
        .collection("books")
        .deleteOne({ _id: new ObjectId(id) });
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "could not delete the document" });
    }
  } else {
    res.status(500).json({ error: "the document id is not valid" });
  }
});

app.patch("/books/:id", async (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  //   check to see if the string id is valid
  if (ObjectId.isValid(id)) {
    try {
      const response = await db
        .collection("books")
        .updateOne({ _id: new ObjectId(id) }, { $set: updates });
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "could not update the document" });
    }
  } else {
    res.status(500).json({ error: "the document id is not valid" });
  }
});
