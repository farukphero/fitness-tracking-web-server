const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterfit.lgaupy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// eee
async function run() {
  try {
    const UsersCollection = client.db("fitlessian").collection("User");
    const servicesCollection = client.db("fitlessian").collection("services");

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await UsersCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UsersCollection.insertOne(user);
      res.send(result);
      // console.log(:)
    });

    app.patch("/users/edit/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          firstname: user.firstname,
          lastname: user.lastname,
          birthday: user.birthday,
          age: user.age,

          permanentAddress: user.permanentAddress,
          phone: user.phone,
          city: user.city,
        },
      };
      const result = await UsersCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).toArray();
      res.send(services);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const services = await UsersCollection.find(query).toArray();
      res.send(services);
    });
  } finally {
  }
}
run();
app.get("/", (req, res) => {
  res.send("Start fitlessian");
});
app.listen(port, () => {
  console.log(`this server is running on ${port}`);
});
