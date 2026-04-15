import express from "express";
import Position from "../models/Position.model.js";

const router = express.Router();

router.post("/", async (req, res) => {

  const position = await Position.create(req.body);

  res.json(position);

});

router.get("/", async (req, res) => {

  const positions = await Position.find();

  res.json(positions);
})

export default router;