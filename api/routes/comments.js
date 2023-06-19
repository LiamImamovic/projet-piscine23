import express from "express";
import { getCommentsByPostId, addComment, getAllComments, deleteComment } from "../controllers/comments.js";

const router = express.Router();

// Définition des routes pour la gestion des commentaires
router.get("/", getAllComments); // Route pour récupérer tous les commentaires
router.get("/posts/:id", getCommentsByPostId); // Route pour récupérer les commentaires d'un article spécifique
router.post("/", addComment); // Route pour ajouter un commentaire
router.delete("/:id", deleteComment); // Route pour supprimer un commentaire

export default router;
