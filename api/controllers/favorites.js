import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getAllFavorites = (req, res) => {
  const { user_id } = req.params;

  const q = `
    SELECT posts.*
    FROM posts
    INNER JOIN favorites ON posts.id = favorites.post_id
    WHERE favorites.user_id = ?`;

  db.query(q, [user_id], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

export const addFavorite = (req, res) => {
  const { post_id, user_id } = req.body;

  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    // Vérification de l'authenticité du token JWT
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      const q = "INSERT INTO favorites (post_id, user_id) VALUES (?, ?)";
      const values = [post_id, user_id];

      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Error adding favorite:", err);
          return res.status(500).json(err);
        }

        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const deleteFavorite = (req, res) => {
  const { id } = req.params;

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  try {
    // Vérification de l'authenticité du token JWT
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }

      const userId = userInfo.userId;
      const q = "DELETE FROM favorites WHERE id = ? AND user_id = ?";
      const values = [id, userId];

      db.query(q, values, (err, data) => {
        if (err) {
          console.error("Error deleting favorite:", err);
          return res.status(500).json(err);
        }

        return res.status(200).json(data);
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const getFavoritesByPostId = (req, res) => {
  const { postId } = req.params;

  const q = `
    SELECT *
    FROM favorites
    WHERE post_id = ?`;

  db.query(q, [postId], (err, data) => {
    if (err) {
      console.error("Error fetching favorites:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};