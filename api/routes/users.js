import express from 'express';
import { deleteUser, getPostByUser, getUser, updateUser, getAllUsers } from '../controllers/user.js';

const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id/posts", getPostByUser);

export default router;