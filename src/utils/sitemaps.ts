import { Sitemap } from "crawlee";

export const getSitemaps = async (domain: string) => {
  let sitemaps: string[] = [];

  // check robots.txt for sitemap
  try {
    const robotsUrl = `https://${domain}/robots.txt`;
    const robotsResponse = await fetch(robotsUrl);

    if (robotsResponse.ok) {
      const robotsText = await robotsResponse.text();
      const sitemapRegex = /Sitemap:\s*(http[^\s]+)/gi;
      let match;

      while ((match = sitemapRegex.exec(robotsText)) !== null) {
        sitemaps.push(match[1]);
        console.log(`Found sitemap in robots.txt: ${match[1]}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching robots.txt from ${domain}:`);
  }

  // check domain/sitemap.xml
  try {
    const sitemapUrl = `https://${domain}/sitemap.xml`;
    const sitemapResponse = await fetch(sitemapUrl);

    if (sitemapResponse.ok) {
      sitemaps.push(sitemapUrl);
    }
  } catch (error) {
    console.error(`Error fetching sitemap.xml from ${domain}:`, error);
  }

  // avoid duplicates
  sitemaps = Array.from(new Set(sitemaps));

  console.log(`Found ${sitemaps.length} sitemaps.`);
  return sitemaps.map((sitemap) => sitemap.trim());
};

export const getSitemapsUrls = async (sitemaps: string[]) => {
  console.log("Fetching sitemap URLs");

  const sitemap = await Sitemap.load(sitemaps);

  console.log(`Found ${sitemap.urls.length} URLs.`);
  return sitemap.urls.map((url) => url.trim());
};

export function getNotInSitemapsUrls(
  sitemapsUrls: string[],
  crawledUrls: string[],
): string[] {
  return crawledUrls.filter((url) => !sitemapsUrls.includes(url));
}
