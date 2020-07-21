const faker = require('faker');
const random = require('random');
const { getDaysBetween } = require('../../utils/manipulateDate');

/**
 * Generate Mock Project
 * Creates a fake project object to be used in seeding the database
 * @returns {{heroVideo: string, subtitle: *, campaignDuration: number, location: *, heroImage: *, launchDate: *,
 *   title: *, category: (*), subcategory: *, fundingGoal: number, rewards: number[], budget: number}}
 */
module.exports.generateMockProject = (project_id) => ({
  project_id: project_id,
  title: faker.commerce.productName(),
  creator: faker.internet.userName(),
  // subtitle: faker.company.catchPhrase(),
  // category: faker.commerce.department(),
  // subcategory: faker.commerce.productAdjective(),
  location: faker.fake('{{address.city}}, {{address.stateAbbr}}'), // need this
  // heroImage: faker.image.image(),
  // heroVideo: 'https://ytroulette.com/',
  // launchDate: faker.date.future().toString(),
  // campaignDuration: getDaysBetween(new Date(), faker.date.future()),
  // budget: Math.floor(faker.finance.amount()),
  // fundingGoal: Math.floor(faker.finance.amount())
});

/**
 * Generate Mock Reward
 * Creates a fake reward object to be used in seeding the database
 * @returns {{time_limit: number, delivery_year: number, pledgeAmount: number, shippingType: string, description: string,
 *   reward_quantity: number, reward_items: [string, string, string], title: string, project_id: number, deliveryMonth:
 *   number}}
 */
module.exports.generateMockReward = () => ({
  title: faker.commerce.productName(),
  pledgeAmount: Math.floor(faker.finance.amount()),
  description: faker.lorem.paragraph().substring(0, 200),
  deliveryMonth: faker.date.month(),
  delivery_year: faker.date.future().getFullYear(),
  // shippingType: faker.company.bsAdjective(), // optional?
  reward_quantity: Math.floor(Math.random() * (500 - 1 + 1)) + 1, // # of backers
  // time_limit: faker.random.number(), // optional?
  // random_id: faker.random.number(), // Where is this used?
  reward_items: Array.from({ length: random.int(1, 6) }, () =>
    faker.commerce.product()
  ).join(',')
});

/**
 * Generate Mock CSV Reward
 * Creates a fake reward csv to be used in seeding the database
 * @returns
 */
module.exports.generateMockCSVRewardMongo = (project_id, reward_id) => {
  // stage our faker data
  const title = faker.commerce.productName();
  const pledgeAmount = Math.floor(faker.finance.amount());
  const description = faker.lorem.paragraph().substring(0, 200);
  const deliveryMonth = faker.date.month();
  const delivery_year = faker.date.future().getFullYear();
  const shippingType = faker.company.bsAdjective();
  const reward_quantity = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
  const time_limit = faker.random.number();
  const random_id = faker.random.number();

  // const reward_items = Array.from({ length: random.int(1, 6) }, () =>
  //   faker.commerce.product()
  // ).join(',')
  // format each CSV line ${project_id};
  return `${reward_id},${project_id},${title},${pledgeAmount},${description},${deliveryMonth},${delivery_year},${shippingType},${reward_quantity},${time_limit},${random_id},` + "[" + "reward_items" + "]" + `\n`;
  // return `${reward_id};${title};${pledgeAmount};${description};${deliveryMonth};${delivery_year};${shippingType};${reward_quantity};${time_limit};${random_id};` + "[" + reward_items + "]" + `\n`;

};

/**
 * Generate Mock CSV Project
 */
module.exports.generateCSVProject = (project_id) => {
  const title = faker.commerce.productName();
  const creator = faker.internet.userName();
  const location = faker.fake('{{address.city}}, {{address.stateAbbr}}');
  // format each CSV line ${project_id};
  return `${project_id},${title},${creator},${'"'}${location}${'"'}\n`;
};

/**
 * Generate Mock CSV Reward (SemiColon Delimiter for PostGres)
 * Creates a fake reward csv to be used in seeding the database
 * @returns
 */
module.exports.generateCSVReward = (reward_id, project_id) => {
  // stage our faker data
  const title = faker.commerce.productName();
  const pledge_amount = Math.floor(faker.finance.amount());
  const reward_description = faker.lorem.paragraph().substring(0, 200);
  const delivery_month = faker.date.month();
  const delivery_year = faker.date.future().getFullYear();
  const reward_quantity = Math.floor(Math.random() * (500 - 1 + 1)) + 1;
  const time_limit = faker.random.number();
  const random_id = faker.random.number();
  const reward_items = Array.from({ length: random.int(1, 6) }, () =>
    faker.commerce.product()
  ).join(',')
  // format each CSV line ${project_id};
  return `${reward_id},${project_id},${title},${pledge_amount},${reward_description},${delivery_month},${delivery_year},${reward_quantity},${time_limit},${random_id},` + '"'+"{" + reward_items + "}"+'"' + `\n`;
};
