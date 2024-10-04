import { namespaceWrapper } from '@_koii/namespace-wrapper';
import { storeFile } from './fileUtils.js';
import { crawl } from './crawler.js';

export async function task(roundNumber) {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
    console.log('Started Task', new Date(), 'TEST');
    // you can optionally return this value to be used in debugging

    console.log('########## Getting titles ##########');
    const titles = await crawl(process.env.KEYWORD); // Chromium doesn't work automated process. Triggering imeout error
    // const titles = ['https://forums.redflagdeals.com/hot-deals-f9/', 'https://www.koii.network/docs/concepts/what-are-tasks/what-are-tasks']; // Title hared coded. Because the above crawl function does not work properly

    // const data = titles.join(', ');

    console.log('########## Saving to the file ########## ', titles);
    const cid = await storeFile(titles);
    
    console.log('########## CID ########## ', cid);
    
    await namespaceWrapper.storeSet('cid', cid);

  } catch (error) {
    console.error('EXECUTE TASK ERROR:', error);
  }
}
