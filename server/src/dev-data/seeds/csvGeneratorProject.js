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
const writeProjects = fs.createWriteStream('projects.csv');
// write our CSV headers
//  return `${project_id},${title},${creator},${location}`;
const postgres = `project_id,title,creator,location\n`

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
  write();
  function write() {
    let ok = true;
    // outer loop for projects (primary record)
    do {
      i -= 1;
      project_id += 1;
      pBar.increment();
      const newProject = generateCSVProject(project_id);
      // this is the last time!
      if (i === 0) {
        const newProject = generateCSVProject(project_id);
        const endTime = new Date().getTime();
        const elapsed = (((endTime - startTime) / 1000) / 60).toFixed(3);
        writer.write(newProject, encoding, callback);
        writer.on('finish', () => {
          console.log(`🏁\nFinished writing ${project_id} primary and ${reward_id} related records to CSV in ${elapsed} minutes \n🏁`);
        });
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet
        ok = writer.write(newProject, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
}

// invoke the function with a callback telling the write to end
const startTime = new Date().getTime();
writeTenMillionProjects(writeProjects, 'utf-8', (totalProjects, totalRewards) => {
  multibar.stop();
  writeProjects.end();
})