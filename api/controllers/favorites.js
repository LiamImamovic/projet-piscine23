// Importation des dépendances
import { db } from "../db.js"; // Importation de la connexion à la base de données
import jwt from "jsonwebtoken"; // Importation de la bibliothèque JWT

// Récupération de tous les favoris d'un utilisateur
export const getAllFavorites = (req, res) => {
  const { user_id } = req.params; // Récupération de l'ID de l'utilisateur depuis les paramètres de la requête

  const q = `
    SELECT posts.*
    FROM posts
    INNER JOIN favorites ON posts.id = favorites.post_id
    WHERE favorites.user_id = ?`; // Requête SQL pour récupérer tous les favoris d'un utilisateur

  // Exécution de la requête SQL dans la base de données
  db.query(q, [user_id], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err); // En cas d'erreur, afficher l'erreur dans la console
      return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
    }

    return res.status(200).json(data); // Renvoyer une réponse avec les données des favoris récupérés
  });
};

// Ajout d'un favori pour un utilisateur
export const addFavorite = (req, res) => {
  const { post_id, user_id } = req.body; // Récupération de l'ID de l'article et de l'ID de l'utilisateur depuis le corps de la requête

  const token = req.cookies.access_token; // Récupération du token JWT depuis les cookies de la requête
  if (!token) {
    return res.status(401).json("Not authenticated!"); // Vérification de l'existence du token
  }

  try {
    // Vérification de l'authenticité du token JWT
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!"); // En cas de token non valide, renvoyer une réponse avec le code d'erreur 403
      }

      const q = "INSERT INTO favorites (post_id, user_id) VALUES (?, ?)"; // Requête SQL pour ajouter un favori dans la base de données
      const values = [post_id, user_id]; // Valeurs à insérer dans la requête SQL

      // Exécution de la requête SQL pour ajouter le favori dans la base de données
      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Error adding favorite:", err); // En cas d'erreur, afficher l'erreur dans la console
          return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
        }

        return res.status(200).json(data); // Renvoyer une réponse avec les données du favori ajouté
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" }); // En cas d'erreur lors de la vérification du token, renvoyer une réponse avec le code d'erreur 401 et un message d'erreur
  }
};

// Suppression d'un favori pour un utilisateur
export const deleteFavorite = (req, res) => {
  const { postId } = req.params; // Récupération de l'ID de l'article depuis les paramètres de la requête

  const token = req.cookies.access_token; // Récupération du token JWT depuis les cookies de la requête
  if (!token) {
    return res.status(401).json("Not authenticated!"); // Vérification de l'existence du token
  }

  try {
    // Vérification de l'authenticité du token JWT
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!"); // En cas de token non valide, renvoyer une réponse avec le code d'erreur 403
      }

      const q = "DELETE FROM favorites WHERE post_id = ? AND user_id = ?"; // Requête SQL pour supprimer un favori de la base de données
      const values = [postId, userInfo.id]; // Valeurs à insérer dans la requête SQL

      // Exécution de la requête SQL pour supprimer le favori de la base de données
      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Error deleting favorite:", err); // En cas d'erreur, afficher l'erreur dans la console
          return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
        }

        return res.status(200).json(data); // Renvoyer une réponse avec les données du favori supprimé
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" }); // En cas d'erreur lors de la vérification du token, renvoyer une réponse avec le code d'erreur 401 et un message d'erreur
  }
};

// Récupération de tous les favoris d'un article
export const getFavoritesByPostId = (req, res) => {
  const { postId } = req.params; // Récupération de l'ID de l'article depuis les paramètres de la requête

  const q = `
    SELECT *
    FROM favorites
    WHERE post_id = ?`; // Requête SQL pour récupérer tous les favoris d'un article

  // Exécution de la requête SQL dans la base de données
  db.query(q, [postId], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err); // En cas d'erreur, afficher l'erreur dans la console
      return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
    }

    return res.status(200).json(data); // Renvoyer une réponse avec les données des favoris récupérés
  });
};

// Récupération de tous les favoris d'un utilisateur
export const getAllFavoritesByUser = (req, res) => {
  const { userId } = req.params; // Récupération de l'ID de l'utilisateur depuis les paramètres de la requête

  const q = `
    SELECT *
    FROM favorites
    WHERE user_id = ?`; // Requête SQL pour récupérer tous les favoris d'un utilisateur

  // Exécution de la requête SQL dans la base de données
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err); // En cas d'erreur, afficher l'erreur dans la console
      return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
    }

    return res.status(200).json(data); // Renvoyer une réponse avec les données des favoris récupérés
  });
};

// Vérification si un article est un favori pour un utilisateur
export const checkFavorite = (req, res) => {
  const { postId } = req.params; // Récupération de l'ID de l'article depuis les paramètres de la requête
  const { userId } = req.query; // Récupération de l'ID de l'utilisateur depuis les paramètres de la requête

  const q = "SELECT * FROM favorites WHERE post_id = ? AND user_id = ?"; // Requête SQL pour vérifier si un article est un favori pour un utilisateur
  const values = [postId, userId]; // Valeurs à insérer dans la requête SQL

  // Exécution de la requête SQL dans la base de données
  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Error checking favorite:", err); // En cas d'erreur, afficher l'erreur dans la console
      return res.status(500).json(err); // Renvoyer une réponse avec le code d'erreur 500
    }

    const isFavorite = data.length > 0; // Vérification si l'article est un favori ou non
    return res.status(200).json({ isFavorite }); // Renvoyer une réponse avec un objet contenant l'indicateur si l'article est un favori ou non
  });
};
