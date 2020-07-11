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
writeProjects.write('id, title, creator, subtitle, category, subcategory, location, heroImage, heroVideo, launchDate, campaignDuration, budget, fundingGoal,\n', 'utf8');

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

function writeTenMillionProjects(writer, encoding, callback) {
  let numOfRecords = 10000000
   //Start CLI progress bar
  bar.start(numOfRecords, 0);
  let i = numOfRecords;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      // stage our faker data
      const title = faker.commerce.productName();
      const pledgeAmount = Math.floor(faker.finance.amount());
      const description = faker.lorem.paragraph().substring(0, 200);
      const deliveryMonth = faker.date.month();
      const deliveryYear = faker.date.future().getFullYear();
      const shippingType = faker.company.bsAdjective();
      const rewardQuantity = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
      const timeLimit = faker.random.number();
      const projectId = faker.random.number();
      const rewardItems = Array.from({ length: random.int(1, 6) }, () =>
        faker.commerce.product()
      ).join(',')
      // format each CSV line
      const data = `${id}, ${title},
      ${pledgeAmount},
      ${description},
      ${deliveryMonth},
      ${deliveryYear},
      ${shippingType},
      ${rewardQuantity},
      ${timeLimit},
      ${projectId},
      ${rewardItems}\n`;
      // this is the last time!
      if (i === 0) {
        bar.increment(); // <- progress bar
        writer.write(data, encoding, callback);
      } else {
      // See if we should continue, or wait.
      // Don't pass the callback, because we're not done yet
      bar.increment(); // <- progress bar
      ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
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
  bar.stop();
  console.log(`Finished writing all updates to CSV in ${elapsed} minutes`);
  writeProjects.end();
})