const faker = require('faker');
const fs = require('fs');
const random = require('random');
const { getDaysBetween } = require('../../utils/manipulateDate');
const cliProgress = require('cli-progress');

/**
 * Generate Projects csv
 */

/* Require the generators for mock data */
const { generateCSVReward, generateCSVProject  } = require('./generator');

// our stream that will be passed as the first argument for our generator function as 'writer'
const writeProjects = fs.createWriteStream('rewards.csv');
// write our CSV headers
const postgres = `reward_id,project_id,title,pledge_amount,reward_description,delivery_month,delivery_year,reward_quantity,time_limit,random_id,reward_items\n`
writeProjects.write(postgres);

const multibar = new cliProgress.MultiBar({ clearOnComplete: false, hideCursor: true }, cliProgress.Presets.rect);

function writeTenMillionProjects(writer, encoding, callback) {

  const numOfRecords = 10000000;
  //Start CLI progress bar
  const pBar = multibar.create(numOfRecords, 0);
  // const rBar = multibar.create(numOfRecords * (minRewards + maxRewards / 2), 0);

  let i = numOfRecords; // 9999999
  let project_id = 0; // 1
  let reward_id = 0; // 1
  function write() {
    let ok = true;
    // outer loop for projects (primary record)
    while (i > 0 && ok) {
      i -= 1;
      project_id += 1;
      pBar.increment();
      // if project_id is between 1 -6 #1 reward
      // if project_id is between 6 -9  #1-3 rewards
      // if project_id is between 9 -10  # 6-7 rewards

      // inner loop for project rewards (related records)
      // if project_id is > 6 mil randomNumRewards += 2
      // if project_id is > 9 mil randomNumRewards += 2
      const minRewards = 3;
      const maxRewards = 6;
      const randomNumRewards = random.int(minRewards, maxRewards);

      // this is the last time!
      if (i === 0) {
        for (let j = 0; j <= randomNumRewards; j++)  {
          reward_id += 1;
          const newReward = generateCSVReward(reward_id, project_id);
          writer.write(newReward, encoding, callback);
        }
        const endTime = new Date().getTime();
        const elapsed = (((endTime - startTime) / 1000) / 60).toFixed(3);
        writer.on('finish', () => {
          console.log(`🏁\nFinished writing ${project_id} primary and ${reward_id} related records to CSV in ${elapsed} minutes \n🏁`);
        });
      } else {
        for (let j = 0; j <= randomNumRewards; j++)  {
          reward_id += 1;

          const newReward = generateCSVReward(reward_id, project_id);
          // See if we should continue, or wait.
          // Don't pass the callback, because we're not done yet
          ok = writer.write(newReward, encoding);
          // rBar.increment(); // <- progress bar
        }
      }
    }
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
  write();
}

// invoke the function with a callback telling the write to end
const startTime = new Date().getTime();
writeTenMillionProjects(writeProjects, 'utf-8', (totalProjects, totalRewards) => {
  multibar.stop();
  writeProjects.end();
})