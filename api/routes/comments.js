import express from "express";
import { getCommentsByPostId, addComment } from "../controllers/comments.js";

const router = express.Router();

router.get("/posts/:id", getCommentsByPostId);
router.post("/", addComment);


export default router;