const express = require("express");
const router = express.Router();

//Get a single user
module.exports = (db) => {
  router.get("/current", (req, res) => {
    const user = req.session.user_id;
    db.query(
      `SELECT * FROM users
              WHERE id = $1;`,
      [user]
    )
      .then((data) => {
        const user = data.rows[0];
        res.send(user);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/:id", (req, res) => {
    const user = req.params.id;
    db.query(
      `SELECT * FROM users
              WHERE id = $1;`,
      [user]
    )
      .then((data) => {
        const user = data.rows[0];
        res.send(user);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const id = req.session.user_id;
    const email = req.body.email;
    const bio = req.body.bio;
    const picture = req.body.picture;

    const queryParams = [id, name, email, bio, picture];

    const queryString = `
        UPDATE users
        SET name = $2,
        email = $3,
        user_bio = $4,
        user_image = $5
        WHERE users.id = $1
        RETURNING *;
    // `;
    db.query(queryString, queryParams)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
