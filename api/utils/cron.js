import cron, { CronJob } from 'cron';
import https from 'https';

const URL = 'https://instagram-cpns.onrender.com';

// Set the cron job to run every 10 minutes
const job = new cron.CronJob("*/10 * * * *", () => {
      https.get(URL, (res) => {
            if (res.statusCode === 200) {
                  console.log("GET request sent successfully");
            } else {
                  console.log("GET request failed");
            }
      }).on('error', (e) => {
            console.log("Error while sending request", e);
      });
});

export default job;
