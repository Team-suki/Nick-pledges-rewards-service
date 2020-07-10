const faker = require('faker');
const fs = require('fs');
const { getDaysBetween } = require('../../utils/manipulateDate');

/**
 * Generate Projects csv
 */

// our stream that will be passed as the first argument for our generator function as 'writer'
const writeProjects = fs.createWriteStream('projects.csv');
// write our CSV headers
writeProjects.write('id, title, creator, subtitle, category, subcategory, location, heroImage, heroVideo, launchDate, campaignDuration, budget, fundingGoal,\n', 'utf8');

function writeTenMillionProjects(writer, encoding, callback) {
  let i = 10000000;
  let id = 0;
  function write() {
    let ok = true;
    do {
      i -= 1;
      id += 1;
      // stage our faker data
      const title = faker.commerce.productName();
      const creator = faker.internet.userName();
      const subtitle = faker.company.catchPhrase();
      const category = faker.commerce.department();
      const subcategory = faker.commerce.productAdjective();
      const location = faker.fake('{{address.city}}, {{address.stateAbbr}}');
      const heroImage = faker.image.image();
      const heroVideo = 'https =//ytroulette.com/';
      const launchDate = faker.date.future().toString();
      const campaignDuration = getDaysBetween(new Date(), faker.date.future());
      const budget = Math.floor(faker.finance.amount());
      const fundingGoal = Math.floor(faker.finance.amount());
      // format each CSV line
      const data = `${id}, ${title}, ${creator}, ${subtitle},
      ${category},
      ${subcategory},
      ${location},
      ${heroImage},
      ${heroVideo},
      ${launchDate},
      ${campaignDuration},
      ${budget},
      ${fundingGoal}\n`;
      // this is the last time!
      if (i === 0) {
        writer.write(data, encoding, callback);
      } else {
      // See if we should continue, or wait.
      // Don't pass the callback, because we're not done yet.
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
writeTenMillionProjects(writeProjects, 'utf-8', () => {
  writeProjects.end();
})