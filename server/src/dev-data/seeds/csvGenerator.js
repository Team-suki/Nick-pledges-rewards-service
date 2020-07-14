const faker = require('faker');
const fs = require('fs');
const random = require('random');
const { getDaysBetween } = require('../../utils/manipulateDate');
const cliProgress = require('cli-progress');

/**
 * Generate Projects csv
 */

// our stream that will be passed as the first argument for our generator function as 'writer'
const writeProjects = fs.createWriteStream('projects.csv');
// write our CSV headers
writeProjects.write('rewardID,title,pledgeAmount,description,deliveryMonth,deliveryYear,shippingType,rewardQuantity,timeLimit,randomId,rewardItems\n','utf8');

const multibar = new cliProgress.MultiBar({ clearOnComplete: false, hideCursor: true }, cliProgress.Presets.rect);

function writeTenMillionProjects(writer, encoding, callback) {
  let numOfRecords = 100
  //Start CLI progress bar
  const pBar = multibar.create(numOfRecords, 0);
  // const rBar = multibar.create(null, 0);
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
      const randomNumRewards = random.int(3, 6);
      // if projectID is > 6 mil randomNumRewards += 2
      // if projectID is > 9 mil randomNumRewards += 2


      // this is the last time!
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
        for (let j = 0; j <= randomNumRewards; j++)  {
          rewardID += 1;

          // rewards bar
          // rBar.setTotal(j, 0);

          // stage our faker data
          const title = faker.commerce.productName();
          const pledgeAmount = Math.floor(faker.finance.amount());
          const description = faker.lorem.paragraph().substring(0, 200);
          const deliveryMonth = faker.date.month();
          const deliveryYear = faker.date.future().getFullYear();
          const shippingType = faker.company.bsAdjective();
          const rewardQuantity = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
          const timeLimit = faker.random.number();
          const randomId = faker.random.number();
          const rewardItems = Array.from({ length: random.int(1, 6) }, () =>
            faker.commerce.product()
          ).join(',')
          // format each CSV line
          var data = `${rewardID},${title},${pledgeAmount},${description},${deliveryMonth},${deliveryYear},${shippingType},${rewardQuantity},${timeLimit},${randomId},${"{"}${rewardItems}${"}"}\n`;
          // See if we should continue, or wait.
          // Don't pass the callback, because we're not done yet
          // rBar.increment(); // <- progress bar
          ok = writer.write(data, encoding);
          pBar.updateETA();
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
writeTenMillionProjects(writeProjects, 'utf-8', () => {
  const endTime = new Date().getTime();
  const elapsed = (((endTime - startTime) / 1000) / 60).toFixed(3);
  multibar.stop();
  console.log(`Finished writing all projects and rewards to CSV in ${elapsed} minutes`);
  writeProjects.end();
})