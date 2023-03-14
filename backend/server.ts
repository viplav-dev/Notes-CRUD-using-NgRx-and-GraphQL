import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { Schema } from "./schema/schema";
const app = express();

//Initializing env file
dotenv.config({ path: "./.env" });

//Connecting to MongoDB
async function connectToMongo() {
  const conn = await mongoose.connect(process.env.MONGO_URI!);

  console.log(`MongoDB Connect: ${conn.connection.host}`);
}
connectToMongo();

//Middlewares
app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    graphiql: process.env.NODE_ENV == "development",
  })
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
