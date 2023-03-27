import { Router } from "express";

export const api = Router();

api.all("/", (req, res) => {
  res.send("OK");
});

export default api;
