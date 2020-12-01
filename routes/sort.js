const express = require("express");
const router = express.Router();

//Get a single user
module.exports = (db) => {
  router.get("/price", (req, res) => {
    const queryString = `SELECT * FROM listings
    JOIN users ON users.id = user_id
    ORDER BY price ${req.query.options}
    LIMIT 20;`;
    db.query(queryString, [])
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/price", (req, res) => {
    const queryString = `SELECT * FROM listings
    JOIN users ON users.id = user_id
    ORDER BY posted_date ${req.query.options}
    LIMIT 20;`;
    db.query(queryString, [])
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
