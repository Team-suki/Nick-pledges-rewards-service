-- schema.sql
-- Since we might run the import many times we'll drop if exists
DROP DATABASE IF EXISTS kickstarter;

CREATE DATABASE kickstarter;

-- Make sure we're using our `kickstarter` database
\c kickstarter;

-- We can create our projects table
CREATE TABLE IF NOT EXISTS projects (
  project_id INTEGER,
  title VARCHAR,
  creator VARCHAR,
  location VARCHAR,
  PRIMARY KEY (project_id)
);

-- We can create our rewards table
CREATE TABLE IF NOT EXISTS rewards (
  reward_id INTEGER,
  project_id INTEGER,
  title VARCHAR,
  pledge_amount VARCHAR,
  reward_description VARCHAR,
  delivery_month VARCHAR,
  delivery_year VARCHAR,
  reward_quantity VARCHAR,
  time_limit VARCHAR,
  random_id VARCHAR,
  reward_items text [],
  PRIMARY KEY (reward_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);