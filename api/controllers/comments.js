// Importation des dépendances
import { db } from "../db.js"; // Importation de la connexion à la base de données
import jwt from "jsonwebtoken"; // Importation de la bibliothèque JWT

// Récupération des commentaires d'un article en fonction de son ID
export const getCommentsByPostId = (req, res) => {
  const postId = req.params.id; // Récupération de l'ID de l'article depuis les paramètres de la requête
  const q = `
    SELECT comments.*, users.username
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?`; // Requête SQL pour récupérer les commentaires et les noms d'utilisateurs associés

  // Exécution de la requête SQL dans la base de données
  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err); // En cas d'erreur, renvoyer une réponse avec le code d'erreur 500

    return res.status(200).json(data); // Renvoyer une réponse avec les données des commentaires récupérés
  });
};

// Ajout d'un commentaire à un article
export const addComment = (req, res) => {
  const token = req.cookies.access_token; // Récupération du token JWT depuis les cookies de la requête
  if (!token) return res.status(401).json("Not authenticated!"); // Vérification de l'existence du token

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // En cas de token non valide, renvoyer une réponse avec le code d'erreur 403

    const q =
      "INSERT INTO comments( `post_id`, `user_id`, `content`) VALUES (?)"; // Requête SQL pour insérer un nouveau commentaire dans la base de données

    const values = [req.body.post_id, userInfo.id, req.body.content]; // Valeurs à insérer dans la requête SQL

    // Exécution de la requête SQL pour ajouter un nouveau commentaire dans la base de données
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err); // En cas d'erreur, renvoyer une réponse avec le code d'erreur 500

      return res.json("Comment has been created."); // Renvoyer une réponse indiquant que le commentaire a été créé avec succès
    });
  });
};

// Récupération de tous les commentaires
export const getAllComments = (req, res) => {
  const q = "SELECT * FROM comments"; // Requête SQL pour récupérer tous les commentaires

  // Exécution de la requête SQL dans la base de données
  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching comments:", err); // En cas d'erreur, afficher l'erreur dans la console
      return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
    }

    return res.status(200).json(data); // Renvoyer une réponse avec les données des commentaires récupérés
  });
};

// Suppression d'un commentaire
export const deleteComment = (req, res) => {
  const token = req.cookies.access_token; // Récupération du token JWT depuis les cookies de la requête
  if (!token) return res.status(401).json("Not authenticated!"); // Vérification de l'existence du token

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!"); // En cas de token non valide, renvoyer une réponse avec le code d'erreur 403

    const commentId = req.params.id; // Récupération de l'ID du commentaire depuis les paramètres de la requête
    const q = "DELETE FROM comments WHERE `id` = ? AND (`user_id` = ? OR (SELECT `isAdmin` FROM users WHERE `id` = ?) = 1)"; // Requête SQL pour supprimer un commentaire de la base de données

    // Exécution de la requête SQL pour supprimer le commentaire de la base de données
    db.query(q, [commentId, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your comments!"); // En cas d'erreur, renvoyer une réponse indiquant que l'utilisateur ne peut supprimer que ses propres commentaires

      return res.json("Comment has been deleted!"); // Renvoyer une réponse indiquant que le commentaire a été supprimé avec succès
    });
  });
};
