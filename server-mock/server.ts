import express from "express";
import api from "./api";

const app = express();

app.use("/api/v1", api);

app.listen(5681, () => console.log("Mock server is running on the port 5681"));
