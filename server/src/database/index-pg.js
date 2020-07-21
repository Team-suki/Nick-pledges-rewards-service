// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
const { connectionString } = require('./../config/connect.js')

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: connectionString,
});


pool.on('error', (err, client) => {
  console.error('Error:', err);
});

const filterBody = (req) => {
  return {
    id: req.body.id,
    title: req.body.title,
    pledgeAmount: req.body.pledgeamount,
    description: req.body.description,
    deliveryMonth: req.body.deliverymonth,
    deliveryYear: req.body.deliveryyear,
    rewardQuantity: req.body.rewardquantity,
    projectId: req.body.projectId,
    rewardItems: req.body.rewarditems,
  };
};

const getSearchQuery = (req) => {
  const searchQuery = {};
  if (req.projectId) {
    searchQuery.projectId = req.projectId;
  }

  if (req.rewardId) {
    searchQuery.id = req.rewardId;
  }

  if (req.id) {
    searchQuery.id = req.id;
  }

  return searchQuery;
};


const testOneProject = (req, res) => {
  const query = {
    // give the query a unique name trso use prepared statements
    // name: 'test-one',
    text: 'SELECT * FROM projects WHERE projectId = $1',
    values: [req.params.id],
  }
  pool.query(query, (err, data) => {
    if (err) {
      console.log(err.stack);
      res.end();
    }
    res.status(200).json(data.rows)
  })
}

const getOneProject = (req, res) => {
  const searchQuery = req.id
  pool.query('SELECT * FROM projects LEFT JOIN rewards ON projects.projectid = rewards.projectId WHERE projects.projectid = $1 LIMIT 1', [searchQuery], (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    }
    res.status(200).json(data.rows)
  })
}

const getRewards = (req, res) => {
  // console.log('++++++Body+++++',req.body)
  const searchQuery = getSearchQuery(req);
  pool.query('SELECT * FROM rewards WHERE projectId = $1', [(searchQuery.projectId || searchQuery.id)], (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).json(data.rows)
  })
};

const createOneReward = (req, res) => {
  const params = filterBody(req);
  pool.query('INSERT INTO rewards (title, pledge_amount, description, delivery_month, delivery_year, reward_quantity, projectId, reward_items) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)' [params.title, params.pledge_amount, params.description, params.delivery_month, params.delivery_year, params.reward_quantity, params.projectId, params.reward_items], (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(201).send(`Reward added with projectId: ${params.projectId}`)
  })
}

const updateOneReward = (req, res) => {
  const searchQuery = getSearchQuery(req);
  const params = filterBody(req);
  pool.query('UPDATE rewards SET title = $1, pledge_amount = $2, description = $3, delivery_month = $4, delivery_year = $5, reward_quantity = $6, projectId = $7, reward_items = $8', [params.title, params.pledge_amount, params.description, params.delivery_month, params.delivery_year, params.reward_quantity, params.projectId, params.reward_items], (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(`Reward updated with projectId: ${params.projectId}`)
  })
}

const deleteOneReward = (req, res) => {
  const searchQuery = getSearchQuery(req);
  pool.query('DELETE FROM rewards WHERE projectId = $1', [(searchQuery.projectId || searchQuery.id)], (err, data) => {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    }
    res.status(200).send(`Reward deleted with projectId: ${params.projectId}`)
  })
}

module.exports = {
  getRewards,
  createOneReward,
  updateOneReward,
  deleteOneReward,
  getOneProject,
  testOneProject
}