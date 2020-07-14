-- schema.sql
-- Since we might run the import many times we'll drop if exists
DROP DATABASE IF EXISTS kickstarter;

CREATE DATABASE kickstarter;

-- Make sure we're using our `blog` database
\c kickstarter;

-- We can create our projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR
);

-- We can create our rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  rewardID INTEGER REFERENCES projects(id),
  title VARCHAR,
  pledgeAmount VARCHAR,
  description VARCHAR,
  deliveryMonth VARCHAR,
  deliveryYear VARCHAR,
  shippingType VARCHAR,
  rewardQuantity VARCHAR,
  timeLimit VARCHAR,
  randomid VARCHAR,
  rewardItems text []
);