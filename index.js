import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";

dotenv.config(); // configuring dotenv

const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

app.use(express.json()); // Express middleware

app.use(cors()); // Configuring cors

const client = await createConnection();

app.get("/", (request, response) => {
  response.send("Welcome to Recorem article page 📃");
});

async function createPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
  return hash;
}
// createPassword("Gowtham");

app.post("/signUp", async (request, response) => {
  const { firstName, secondName, email, password } = request.body;

  const hashPassword = await createPassword(password);

  const createUser = {
    firstName: firstName,
    secondName: secondName,
    email: email,
    password: hashPassword,
  };
  //   console.log({password:password});
  const userFromDb = await client

    .db("forms")
    .collection("form")
    .insertOne(createUser);
  response.send(userFromDb);
});

app.listen(PORT, () => console.log(`app connected to port${PORT}`));

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("MongoDB connected to Server 😍😎 ");
  return client;
}
