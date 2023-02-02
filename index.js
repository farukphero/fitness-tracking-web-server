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
    const usersCollection = client.db("fitlessian").collection("User");
    const servicesCollection = client.db("fitlessian").collection("services");
    const FoodsCollection = client.db(`fitlessian`).collection(`foods`);
    const ActivitiesCollection = client
      .db(`fitlessian`)
      .collection(`Activities`);
    const foodCollection = client.db("fitlessian").collection("foods");
    const loggedFoodCollection = client
      .db("fitlessian")
      .collection("loggedFood");
    const tutorialCollection = client.db("fitlessian").collection("tutorials");
    const categoryCollection = client.db("fitlessian").collection("category");
    const favoriteFoodCollection = client
      .db("fitlessian")
      .collection("favouriteFood");
    const postCollection = client.db("fitlessian").collection("post");

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await UsersCollection.findOne(query);
      res.send(result);
      // console.log(result)
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await UsersCollection.insertOne(user);
      res.send(result);
    });

    // userpost
    app.post("/post", async (req, res) => {
      const user = req.body;
      const result = await postCollection.insertOne(user);
      res.send(result);
    });
    app.get("/post", async (req, res) => {
      const user = {};
      const result = await postCollection.find(user).toArray();
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

    app.post("/tutorial", async (req, res) => {
      const post = req.body;
      const result = await tutorialCollection.insertOne(post);
      console.log(result);
      res.send(result);
    });

    app.get("/tutorials", async (req, res) => {
      const category = req.query.category;
      const query = {
        category: category,
      };
      const cursor = tutorialCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/category", async (req, res) => {
      const post = req.body;
      const result = await categoryCollection.insertOne(post);
      console.log(result);
      res.send(result);
    });

    app.get("/singleCategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });

    app.get("/categories", async (req, res) => {
      const query = {};
      const categories = await categoryCollection.find(query).toArray();
      res.send(categories);
    });
    // --------------
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await servicesCollection.findOne(query);

      res.send(result);
    });
    app.put("/users/edit/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          firstName: user.firstName,
          lastName: user.lastName,
          birthday: user.birthday,
          age: user.age,
          permanentAddress: user.permanentAddress,
          phone: user.phone,
          city: user.city,
          picture: user.picture,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const services = await servicesCollection.find(query).toArray();
      res.send(services);
    });
    app.get("/users", async (req, res) => {
      const query = {};
      const services = await usersCollection.find(query).toArray();

      res.send(services);
    });

    app.get("/foods", async (req, res) => {
      const query = {};
      const foods = await foodCollection.find(query).toArray();
      res.send(foods);
    });

    app.post(`/foods`, async (req, res) => {
      const food = req.body;
      const result = await FoodsCollection.insertOne(food);
      res.send(result);
    });

    app.get(`/foods`, async (req, res) => {
      const food = {};
      const result = await FoodsCollection.find(food).toArray();
      res.send(result);
    });

    // activities apis by @euhansarkar

    app.post(`/activities`, async (req, res) => {
      const activity = req.body;
      const result = await ActivitiesCollection.insertOne({
        ...activity,
        timestamp: new Date(activity.activity_date),
      });
      res.send(result);
    });

    app.delete(`/activities/:id`, async (req, res) => {
      const activity = req.params.id;
      const query = { id: ObjectId(activity) };
      const result = await ActivitiesCollection.deleteOne(query);
      res.send(result);
    });

    app.get(`/activities`, async (req, res) => {
      const email = req.query.activist;
      const query = { activist: email };
      const result = await ActivitiesCollection.find(query).toArray();
      res.send(result);
    });

    // last 24 hour data

    app.get(`/activities/1`, async (req, res) => {
      const email = req.query.activist;
      const query = {
        activist: email,
        timestamp: {
          $lt: new Date(),
          $gt: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        },
      };
      const result = await ActivitiesCollection.find(query).toArray();
      res.send(result);
    });

    // last 7 days data

    app.get(`/activities/7`, async (req, res) => {
      const email = req.query.activist;
      const query = {
        activist: email,
        timestamp: {
          $lt: new Date(),
          $gt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      };
      const result = await ActivitiesCollection.find(query).toArray();
      res.send(result);
    });

    // last 30 days data

    app.get(`/activities/30`, async (req, res) => {
      const email = req.query.activist;
      const query = {
        activist: email,
        timestamp: {
          $lt: new Date(),
          $gt: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        },
      };
      const result = await ActivitiesCollection.find(query).toArray();
      res.send(result);
    });

    // last 365 days data

    app.get(`/activities/365`, async (req, res) => {
      const email = req.query.activist;
      const query = {
        activist: email,
        timestamp: {
          $lt: new Date(),
          $gt: new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000),
        },
      };
      const result = await ActivitiesCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/loggedFood", async (req, res) => {
      const loggedFood = req.body;
      const result = await loggedFoodCollection.insertOne(loggedFood);
      res.send(result);
    });

    app.get("/favouriteFood/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const favoriteFood = await favoriteFoodCollection.find(query).toArray();
      res.send(favoriteFood);
    });

    // favourite Food
    app.post("/favouriteFood", async (req, res) => {
      const favoriteFood = req.body;
      const result = await favoriteFoodCollection.insertOne(favoriteFood);
      res.send(result);
    });

    app.get("/loggedFood/:email", async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const loggedFood = await loggedFoodCollection.find(query).toArray();
      res.send(loggedFood);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });

    app.put("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
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
