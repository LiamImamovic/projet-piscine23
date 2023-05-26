import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getCommentsByPostId = (req, res) => {
  const postId = req.params.id;
  const q = `
  SELECT comments.*, users.username
  FROM comments
  JOIN users ON comments.user_id = users.id
  WHERE comments.post_id = ?`;

  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO comments( `post_id`, `user_id`, `content`) VALUES (?)";

    const values = [req.body.post_id, userInfo.id, req.body.content];

    // Ajout d'un nouvel article de blog dans la base de données
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Comment has been created.");
    });
  });
};


export const getAllComments = (req, res) => {
  const q = "SELECT * FROM comments";

  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  
  // Vérification de l'authenticité du token JWT
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    
    
    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND (`user_id` = ? OR (SELECT `isAdmin` FROM users WHERE `id` = ?) = 1)";

    // Suppression d'un article de blog de la base de données
    db.query(q, [commentId, userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your comments!");

      return res.json("Comment has been deleted!");
    });
  });
};
