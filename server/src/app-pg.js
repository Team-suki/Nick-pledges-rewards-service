require('newrelic');
const path = require('path');
const express = require('express');
const db = require('./database/index-pg');
const paramPluck = require("./middleware/paramPluck");


// Get the port from environment variables, or set manually if not exist
const PORT = process.env.PORT || 3001;

// Initialize the app as our express framework
const app = express();

// Allow the app to use the body-parser middleware so we can accept JSON body data"No query parameters were provided in the request"
app.use(express.json());




// projects
app.get("/api/projects/find", paramPluck, db.getOneProject);
app.get("/api/projects/test/:id", db.testOneProject);

// rewards
app.get("/api/rewards", paramPluck, db.getRewards);
app.post("/api/rewards", paramPluck, db.createOneReward);
app.put("/api/rewards", paramPluck, db.updateOneReward);
app.patch("/api/rewards", paramPluck, db.updateOneReward);
app.delete("/api/rewards", paramPluck, db.deleteOneReward);

// Serve up the dist folder from the client at the defined PORT
app.use("/", express.static(path.resolve(__dirname, "../../client/dist")));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/dist/index.html'))
})

// we're connected!
app.listen(PORT, () => console.log(`Express for pg listening at http://localhost:${PORT}`))
