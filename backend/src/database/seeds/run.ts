import dataSource from '../../../data-source';
import { runSeeders } from 'typeorm-extension';

async function run() {
  await dataSource.initialize();
  await runSeeders(dataSource);
  process.exit();
}

run()
  .then(() => {
    console.log('Seeded completed..!!');
  })
  .catch((e) => {
    console.log('Error in seeding:- ', e);
  });
