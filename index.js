const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `${process.env.DB_CONNECT}`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
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
    const logedWeightCollection = client
      .db("fitlessian")
      .collection("logedWeight");
    const weightGoalCollection = client
      .db("fitlessian")
      .collection("weightGoal");
    const commentCollection = client.db("fitlessian").collection("comment");
    const loggedWaterCollection = client
      .db("fitlessian")
      .collection("loggedWater");
    const questionsCollection = client.db("fitlessian").collection("questions");
    // const friendsCollection = client.db("fitlessian").collection("friends");
    const sendRequestCollection = client
      .db("fitlessian")
      .collection("friendRequest");
    const userAgeCollection = client
      .db("fitlessian")
      .collection("usersAgeForServices");
    const instructorsCollection = client
      .db(`fitlessian`)
      .collection(`Instructors`);

    const AnswerCollection = client.db(`fitlessian`).collection(`answer`);

    const messagesCollection = client.db("fitlessian").collection("messages");
    const instructorCollection = client
      .db("fitlessian")
      .collection("instructor");

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
    app.post("/ans", async (req, res) => {
      const user = req.body;
      const result = await AnswerCollection.insertOne(user);

      res.send(result);
    });
    app.get("/answer", async (req, res) => {
      const user = {};
      const result = await AnswerCollection.find(user).toArray();
      res.send(result);
    });

    // userpost rumel
    app.post("/post", async (req, res) => {
      const user = req.body;
      const result = await postCollection.insertOne(user);
      res.send(result);
    });
    // postdata from mongodb rumel
    app.get("/post", async (req, res) => {
      const user = {};
      const result = await postCollection.find(user).toArray();
      res.send(result);
    });

    // instructor
    app.get("/instructor", async (req, res) => {
      const user = {};
      const result = await instructorCollection.find(user).toArray();
      res.send(result);
    });
    app.get("/instructor/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await instructorCollection.findOne(filter);
      res.send(result);
    });

    // postlike rumel
    app.put("/post/:id", async (req, res) => {
      const post = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          liking: post?.like,
          likeusersname: post?.username,
        },
      };
      const result = await postCollection.updateMany(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    // questions rumel
    app.post("/questions", async (req, res) => {
      const post = req.body;
      const result = await questionsCollection.insertOne(post);
      res.send(result);
    });

    app.get("/question", async (req, res) => {
      const query = {};
      const result = await questionsCollection.find(query).toArray();
      res.send(result);
    });
    // comment rumel
    app.post("/post/comment/:id", async (req, res) => {
      const post = req.body;

      const result = await commentCollection.insertOne(post);
      res.send(result);
    });
    // comment every post by all users rumel
    app.get("/post/comment/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        commentId: id,
      };
      const result = await commentCollection.find(query).toArray();
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

    // Tutorial post (tahmina)
    app.post("/tutorial", async (req, res) => {
      const post = req.body;
      const result = await tutorialCollection.insertOne(post);
      res.send(result);
    });
    // Get tutorial query by category (tahmina)
    app.get("/tutorials", async (req, res) => {
      const category = req.query.category;
      const query = {
        category: category,
      };
      const cursor = tutorialCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // post logedWeight (tahmina)
    app.post("/logedWeight", async (req, res) => {
      const post = req.body;
      const result = await logedWeightCollection.insertOne(post);
      res.send(result);
    });

    // get logedWeight by email (tahmina)
    app.get("/logedWeight", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await logedWeightCollection
        .find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    // weight goal update/ post by email (tahmina)
    app.patch("/weightGoal/:email", async (req, res) => {
      const filter = { email: req.params.email };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          expectedWeight: user.expectedWeight,
          goalType: user.goalType,
          email: user.email,
          days: user.days,
          date: user.date,
        },
      };
      const result = await weightGoalCollection.updateOne(
        filter,
        updatedUser,
        option
      );

      res.send(result);
    });

    // get expected weight (tahmina)
    app.get("/weightGoal", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const result = await weightGoalCollection.find(query).toArray();
      res.send(result);
    });

    // delete logedWeight (tahmina)
    app.delete("/logedWeight/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await logedWeightCollection.deleteOne(query);

      res.send(result);
    });

    // tutorial category post(tahmina)

    app.post("/category", async (req, res) => {
      const post = req.body;
      const result = await categoryCollection.insertOne(post);
      res.send(result);
    });
    // Category get bt id (tahmina)
    app.get("/singleCategory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await categoryCollection.findOne(query);
      res.send(result);
    });
    // All category get (tahmina)
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

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
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
    // post water
    app.post("/loggedWater", async (req, res) => {
      const loggedWater = req.body;
      const result = await loggedWaterCollection.insertOne(loggedWater);
      res.send(result);
    });
    // get logged water
    app.get("/loggedWater/:email", async (req, res) => {
      const email = req.params.email;
      const date = req.query.date;
      const query = { email: email, date: date };
      const loggedWater = await loggedWaterCollection.find(query).toArray();
      res.send(loggedWater);
    });
    // delete loged water
    app.delete("/loggedWater/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await loggedWaterCollection.deleteOne(query);
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

    app.get(`/allactivities`, async (req, res) => {
      const email = req.query.activist;
      const query = { activist: email };
      const result = await ActivitiesCollection.find(query)
        .limit(3)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });
    app.get(`/allActivity`, async (req, res) => {
      const email = req.query.activist;
      const query = { activist: email };
      const result = await ActivitiesCollection.find(query)
        .sort({ _id: -1 })
        .toArray();
      res.send(result);
    });

    app.delete(`/activities/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ActivitiesCollection.deleteOne(query);
      res.send(result);
    });

    app.get(`/activities`, async (req, res) => {
      const email = req.query.activist;
      const query = { activist: email };
      const result = await ActivitiesCollection.find(query)
        .sort({ activity_date: -1 })
        .limit(7)
        .toArray();
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
      const favoriteFood = await favoriteFoodCollection
        .find(query)
        .limit(3)
        .sort({ _id: -1 })
        .toArray();
      res.send(favoriteFood);
    });
    app.get("/allFavouriteFood/:email", async (req, res) => {
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
      const date = req.query.date;
      const query = { userEmail: email, date: date };
      const loggedFood = await loggedFoodCollection.find(query).toArray();
      res.send(loggedFood);
    });
    //  admin part start by faruk
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

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    //  admin part end
    //  -----------------------------------------

    // delete favoriteFood
    app.delete("/favoriteFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await favoriteFoodCollection.deleteOne(query);
      res.send(result);
    });

    // delete loggedFood
    app.delete("/loggedFood/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await loggedFoodCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/favouriteFoods/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const favoriteFood = await foodCollection.find(query).toArray();
      res.send(favoriteFood);
    });

    app.get("/foods/seven/:email", async (req, res) => {
      const email = req.params.email;
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysAgoDateOnly = sevenDaysAgo.toLocaleDateString();
      const food = await loggedFoodCollection
        .find({ date: { $gte: sevenDaysAgoDateOnly }, userEmail: email })
        .toArray();
      res.send(food);
    });
    // send and accept friend request by faruk

    app.post("/friendRequest", async (req, res) => {
      const friend = req.body;
      const result = await sendRequestCollection.insertOne(friend);
      const sendFrom = friend.senderEmail;
      const sendTo = friend.receiverEmail;
      const updateSendTo = await usersCollection.updateOne(
        { email: sendFrom },
        { $addToSet: { sendTo: sendTo } }
      );
      const updateSendFrom = await usersCollection.updateOne(
        { email: sendTo },
        { $addToSet: { sendFrom: sendFrom } }
      );
      res.send(updateSendFrom);
    });
    app.post("/cancelFriendRequest", async (req, res) => {
      const friend = req.body;
      // const result = await sendRequestCollection.insertOne(friend);
      const sendFrom = friend.senderEmail;
      const sendTo = friend.receiverEmail;
      const cancelSendTo = await usersCollection.updateOne(
        { email: sendFrom },
        { $pull: { sendTo: sendTo } }
      );
      const cancelSendFrom = await usersCollection.updateOne(
        { email: sendTo },
        { $pull: { sendFrom: sendFrom } }
      );
      res.send(cancelSendFrom);
    });
    app.post("/acceptFriendRequest", async (req, res) => {
      const friend = req.body;
      const sendFrom = friend.senderEmail;
      const sendTo = friend.receiverEmail;
      const friendName = friend.firstName + friend.lastName;
      const receiverPicture = friend.receiverPicture;
      const displayName = friend.displayName;
      const senderPicture = friend.senderPicture;
      const receiverId = friend.receiverId;
      const senderId = friend.senderId;
      const receiverNewFriend = {
        friendEmail: sendFrom,
        name: friendName,
        image: receiverPicture,
        receiverId: receiverId,
      };
      const senderNewFriend = {
        friendEmail: sendTo,
        name: displayName,
        image: senderPicture,
        senderId: senderId,
      };
      const options = { upsert: true };
      // for use double condition
      const acceptSendFrom = await usersCollection.updateOne(
        { email: sendTo },
        {
          $push: { newFriend: receiverNewFriend },
          $set: { accepted: true },
        }
      );
      const acceptSendTo = await usersCollection.updateOne(
        { email: sendFrom },
        {
          $push: { newFriend: senderNewFriend },
          $set: { accepted: true },
        }
      );
      res.send(acceptSendTo);
    });

    app.get("/friends/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const acceptSendFrom = await usersCollection.findOne(query);
      res.send(acceptSendFrom);
    });

    app.get("/friends", async (req, res) => {
      const email = req.query.email;
      const query = {
        email: email,
      };
      const friends = await usersCollection.find(query).toArray();
      res.send(friends);
    });
    // message start

    app.post("/messages", async (req, res) => {
      const msg = req.body;
      const result = await messagesCollection.insertOne(msg);
      res.send(result);
    });

    app.get("/getMessages/:user/:friendEmail", async (req, res) => {
      const user = req.params.user;
      const friendEmail = req.params.friendEmail;
      const allMessages = await messagesCollection.find().toArray();
      const result = allMessages.filter(
        (msg) =>
          (msg.user === user && msg.friendEmail === friendEmail) ||
          (msg.user === friendEmail && msg.friendEmail === user)
      );
      res.send(result);
    });
    // message end

    app.patch("/usersAgeForServices/:id", async (req, res) => {
      const id = req.params.id;
      const usersAgeForServices = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          age: usersAgeForServices,
        },
      };
      const options = { upsert: true };
      const result = await userAgeCollection.updateMany(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/usersAgeForServices", async (req, res) => {
      const query = {};
      const result = await userAgeCollection.find(query).toArray();
      res.send(result);
    });

    // video calling page api by @euhansarkar

    app.get(`/instructors`, async (req, res) => {
      const query = {};
      const result = await instructorsCollection.find(query).toArray();
      res.send(result);
    });

    app.get(`/instructors/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await instructorsCollection.findOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
app.get("/", (req, res) => {
  res.send("Start fitlessian");
});

app.listen(port, () => {
  console.log(`This server is running on ${port}`);
});
