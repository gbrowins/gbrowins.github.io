# gbrowins.github.io
Just for serving web pages

To test after pushing changes, must wait for Actions -> `pages build and deploy` workflow to complete.
Can also add a query-busting QS arg to the page: https://yourusername.github.io/start.html?v=2

The live DuckDuckGo suggestions rely on a free-tier Cloudflare worker to handle the CORS issues.
I signed up for this using my yahoo.com account. This needs the following line:
```
const WORKER_URL = 'https://ddg-suggest.gbrowins.workers.dev';
```