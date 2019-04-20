const bodyParser = require("body-parser");
const searchAgentRoute = require("../routes/searchAgentRoute");
module.exports = main => {
  main.use(bodyParser.json());
  main.use(bodyParser.urlencoded({ extended: false }));
  main.use("/api/v1/searchagents", searchAgentRoute);
};
