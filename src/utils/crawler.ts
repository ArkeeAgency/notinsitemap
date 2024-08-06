import { CheerioCrawler, Configuration } from "crawlee";

import { updateStatus } from "./status-manager";

export async function crawlUrls(
  domain: string,
  uuid: string,
  sitemapsUrls: string[],
): Promise<string[]> {
  const crawledUrls: string[] = [];

  const crawler = new CheerioCrawler(
    {
      async requestHandler({ request, _$, enqueueLinks }) {
        crawledUrls.push(request.loadedUrl);
        updateStatus(
          uuid,
          "crawling",
          crawledUrls.length,
          (await crawler.getRequestQueue()).getTotalCount(),
        );
        console.log(
          `${crawledUrls.length}/${sitemapsUrls.length}: ${request.loadedUrl}`,
        );
        await enqueueLinks();
      },
      maxRequestsPerCrawl: 50000,
    },
    new Configuration({
      persistStorage: true,
      purgeOnStart: true,
    }),
  );

  console.log(`Adding ${sitemapsUrls.length} urls to the crawler queue.`);
  await crawler.addRequests(sitemapsUrls);
  await crawler.run();

  updateStatus(
    uuid,
    "completed",
    crawledUrls.length,
    (await crawler.getRequestQueue()).getTotalCount(),
  );

  return crawledUrls;
}
