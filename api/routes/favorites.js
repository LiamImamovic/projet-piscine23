import express from "express";
import {
  getAllFavorites,
  addFavorite,
  deleteFavorite,
  getFavoritesByPostId,
  getAllFavoritesByUser,
  checkFavorite,
} from "../controllers/favorites.js";

const router = express.Router();

// Définition des routes pour la gestion des favoris
router.get("/", getAllFavorites); // Route pour récupérer tous les favoris
router.post("/", addFavorite); // Route pour ajouter un favori
router.delete("/:postId", deleteFavorite); // Route pour supprimer un favori en utilisant l'ID de l'article
router.get("/:postId", getFavoritesByPostId); // Route pour récupérer les favoris d'un article spécifique en utilisant l'ID de l'article
router.get("/user/:userId", getAllFavoritesByUser); // Route pour récupérer tous les favoris d'un utilisateur spécifique en utilisant l'ID de l'utilisateur
router.get("/check/:postId", checkFavorite); // Route pour vérifier si un article est marqué comme favori en utilisant l'ID de l'article

export default router;
