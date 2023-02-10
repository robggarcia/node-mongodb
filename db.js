const { MongoClient } = require("mongodb");

let dbConnection;

const uriLocal = "mongodb://localhost:27017/bookstore";
const uriAtlas =
  "mongodb+srv://yoshi:test123@cluster0.tvnuyyw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uriAtlas);

const connectToDb = async (cb) => {
  try {
    dbConnection = client.db();
    return cb();
  } catch (error) {
    console.log(error);
    return cb(error);
  }
};

const getDb = () => dbConnection;

module.exports = {
  connectToDb,
  getDb,
};
