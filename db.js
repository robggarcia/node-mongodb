const { MongoClient } = require("mongodb");

let dbConnection;
const client = new MongoClient("mongodb://localhost:27017/bookstore");

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
