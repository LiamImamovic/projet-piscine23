import express from "express";
import { getAllFavorites, addFavorite, deleteFavorite, getFavoritesByPostId } from "../controllers/favorites.js";

const router = express.Router();

router.get("/", getAllFavorites);
router.post("/", addFavorite);
router.delete("/:id", deleteFavorite);
router.get("/:postId", getFavoritesByPostId);


export default router;