/* Import Modules */
const path = require("path");
const express = require("express");
const paramPluck = require("./middleware/paramPluck");
const {
  getOneProject,
  getUserImage,
  createOneProject
} = require("./controllers/projectController");

const { getRewards, createOneReward, updateOneReward, deleteOneReward  } = require("./controllers/rewardController");

// Initialize the app as our express framework
const app = express();

// Allow the app to use the body-parser middleware so we can accept JSON body data
app.use(express.json()); //Limit body to 10kb

// GET
app.get("/api/projects/find", paramPluck, getOneProject);
app.get("/api/rewards", paramPluck, getRewards);

// POST
app.post("/api/projects", paramPluck, createOneProject);
app.post("/api/rewards", paramPluck, createOneReward);

// PUT
app.put("/api/rewards", paramPluck, updateOneReward);

// DELETE
app.delete("/api/rewards", paramPluck, deleteOneReward);

// Serve up the dist folder from the client at the defined PORT
app.use("/", express.static(path.resolve(__dirname, "../../client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'))
})
// Export the App module
module.exports = app;
