const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01makvu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// eee
async function run(){
  try{
    const usersCollection = client.db('fitLessian').collection('users');
    const user={name:"tahmina",roll:"developer"}
    const result= await usersCollection.insertOne(user);
    console.log(result);
  }finally{

  }
}
run().catch(err => console.log(err));
