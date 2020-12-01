const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/count", (req, res) => {
    const userId = req.session.user_id;
    const queryParams = [userId];
    const queryString = `
    SELECT COUNT(*) FROM messages
    WHERE receiver_id = $1;
    `;
    db.query(queryString, queryParams)
      .then((count) => {
        res.send(count);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get all messages for a given listing
  router.get("/:id", (req, res) => {
    const userID = req.session.user_id;
    const listingID = req.params.id;
    db.query(
      `SELECT messages.id, messages.time, listing_id, sender_id, receiver_id, listings.user_id AS owner_id, listings.title, messages.message, senders.name AS sender, receivers.name AS receiver
              FROM messages
              JOIN users senders ON sender_id = senders.id
              JOIN users receivers ON receiver_id = receivers.id
              JOIN listings ON listing_id = listings.id
              WHERE (sender_id = $1
              OR receiver_id = $1)
              AND listing_id = $2;`,
      [userID, listingID]
    )
      .then((data) => {
        const returnData = {
          messages: data.rows,
          user_id: req.session.user_id,
        };
        res.send(returnData);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //Get all messages for a user
  router.get("/", (req, res) => {
    const userID = req.session.user_id;
    db.query(
      `SELECT listing_id, senders.id, receivers.id, listings.title, senders.name AS sender, receivers.name AS receiver
              FROM messages
              JOIN users senders ON sender_id = senders.id
              JOIN users receivers ON receiver_id = receivers.id
              JOIN listings ON listing_id = listings.id
              WHERE sender_id = $1
              OR receiver_id = $1
              GROUP BY listing_id, senders.id, receivers.id, listings.title, senders.name, receivers.name;`,
      [userID]
    )
      .then((data) => {
        const returnData = {
          messages: data.rows,
          user_id: req.session.user_id,
        };
        res.send(returnData);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:id", (req, res) => {
    const userId = req.session.user_id;
    const listingId = req.params.id;
    const message = req.body.message;
    const receiver = req.body.receiver;
    db.query(
      `INSERT INTO messages (listing_id, receiver_id, sender_id, message, time)
              VALUES ($1, $2, $3, $4, now());`,
      [listingId, receiver, userId, message]
    )
      .then((data) => {
        const messages = data.rows;
        res.send(messages);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
