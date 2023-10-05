import mongoose from "mongoose";
import { MONGO_URI } from "#/utils/variables";

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("db connection failed: ", err);
  });
