import express from "express";
import { getCommentsByPostId, addComment, getAllComments, deleteComment } from "../controllers/comments.js";

const router = express.Router();

router.get("/", getAllComments);
router.get("/posts/:id", getCommentsByPostId);
router.post("/", addComment);
router.delete("/:id", deleteComment);


export default router;