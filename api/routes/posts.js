import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/posts.js";

const router = express.Router();

// Définition des routes pour la gestion des articles
router.get("/", getPosts); // Route pour récupérer tous les articles
router.get("/:id", getPost); // Route pour récupérer un article spécifique en utilisant l'ID de l'article
router.post("/", addPost); // Route pour ajouter un nouvel article
router.delete("/:id", deletePost); // Route pour supprimer un article en utilisant l'ID de l'article
router.put("/:id", updatePost); // Route pour mettre à jour un article en utilisant l'ID de l'article

export default router;
