// /utils/crawler.ts
import { CheerioCrawler, Configuration } from "crawlee";

import { updateStatus } from "./status-manager";

export async function crawlUrls(
  domain: string,
  sitemapsUrls: string[],
): Promise<string[]> {
  const crawledUrls: string[] = [];

  const crawler = new CheerioCrawler(
    {
      async requestHandler({ request, _$, enqueueLinks }) {
        crawledUrls.push(request.loadedUrl);
        updateStatus(domain, "in-progress", crawledUrls.length);
        console.log(
          `${crawledUrls.length}/${sitemapsUrls.length}: ${request.loadedUrl}`,
        );
        await enqueueLinks();
      },
      maxRequestsPerCrawl: 50000,
    },
    new Configuration({
      persistStorage: false,
      purgeOnStart: false,
    }),
  );

  console.log(`Adding ${sitemapsUrls.length} urls to the crawler queue.`);
  await crawler.addRequests(sitemapsUrls);
  await crawler.run();

  updateStatus(domain, "completed", crawledUrls.length);

  return crawledUrls;
}
