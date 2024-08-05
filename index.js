import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./src/route/user.js";
import ticketRouter from "./src/route/ticket.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB successfully"))
  .catch((error) => {
    console.log(error);
  });

app.use(userRouter);
app.use(ticketRouter);

app.use((req, res) => {
  return res
    .status(404)
    .send({ message: "Sorry, this endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Your application is launched successfully on port ${process.env.PORT}`
  );
});
