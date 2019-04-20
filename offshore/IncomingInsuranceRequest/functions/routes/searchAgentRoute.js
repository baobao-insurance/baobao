const express = require("express");

const router = express.Router();
const searchIncomingTicket = require("../services/searchAgent");

// Search Agent
router.post("/", async (req, res) => {
  let ticket = req.body;
  let agents;
  try {
    agents = await searchIncomingTicket(ticket);
  } catch (ex) {
    res.status(401).send(ex);
  }
  res.status(200).send(agents);
});

module.exports = router;
