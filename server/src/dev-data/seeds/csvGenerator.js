const faker = require('faker');
const fs = require('fs');
const random = require('random');
const { getDaysBetween } = require('../../utils/manipulateDate');
const cliProgress = require('cli-progress');

/**
 * Generate Projects csv
 */

/* Require the generators for mock data */
const { generateMockCSVReward } = require('./generator');

// our stream that will be passed as the first argument for our generator function as 'writer'
const writeProjects = fs.createWriteStream('projects.csv');
// write our CSV headers
writeProjects.write('rewardID,title,pledgeAmount,description,deliveryMonth,deliveryYear,shippingType,rewardQuantity,timeLimit,randomId,rewardItems\n','utf8');

const multibar = new cliProgress.MultiBar({ clearOnComplete: false, hideCursor: true }, cliProgress.Presets.rect);

function writeTenMillionProjects(writer, encoding, callback) {

  const numOfRecords = 10000000;
  //Start CLI progress bar
  const pBar = multibar.create(numOfRecords, 0);
  // const rBar = multibar.create(numOfRecords * (minRewards + maxRewards / 2), 0);

  let i = numOfRecords; // 9999999
  let projectID = 0; // 1
  let rewardID = 0; // 1
  function write() {
    let ok = true;
    // outer loop for projects (primary record)
    while (i > 0 && ok) {
      i -= 1;
      projectID += 1;
      pBar.increment();
      // if projectID is between 1 -6 #1 reward
      // if projectID is between 6 -9  #1-3 rewards
      // if projectID is between 9 -10  # 6-7 rewards

      // inner loop for project rewards (related records)
      // if projectID is > 6 mil randomNumRewards += 2
      // if projectID is > 9 mil randomNumRewards += 2
      const minRewards = 3;
      const maxRewards = 6;
      const randomNumRewards = random.int(minRewards, maxRewards);

      // this is the last time!
      if (i === 0) {
        const newReward = generateMockCSVReward(projectID, rewardID);
        const endTime = new Date().getTime();
        const elapsed = (((endTime - startTime) / 1000) / 60).toFixed(3);
        writer.write(newReward, encoding, callback);
        writer.on('finish', () => {
          console.log(`🏁\nFinished writing ${projectID} primary and ${rewardID} related records to CSV in ${elapsed} minutes \n🏁`);
        });
        // pBar.increment(); // <- progress bar
      } else {
        for (let j = 0; j <= randomNumRewards; j++)  {
          rewardID += 1;

          const newReward = generateMockCSVReward(projectID, rewardID);
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