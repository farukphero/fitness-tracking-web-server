const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterfit.lgaupy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// eee
async function run() {
  try {
    const UsersCollection = client.db("fitlessian").collection("User")
    const servicesCollection = client.db("fitlessian").collection("services")

// this is my code
    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await UsersCollection.insertOne(user)
      res.send(result)
    })

    app.get('/user/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email : email }
      const result = await servicesCollection.findOne(query)
      res.send(result)
    })
   

    app.get('/services', async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).toArray();
      res.send(services)
    })


  } finally {

  }
}
run()
app.get('/', (req, res) => {
  res.send('Start fitlessian')
})
app.listen(port, () => {
  console.log(`this server is running on ${port}`)
})
