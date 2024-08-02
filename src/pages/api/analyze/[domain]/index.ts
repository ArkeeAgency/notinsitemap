import type { NextApiRequest, NextApiResponse } from "next";

import { crawlUrls } from "../../../../utils/crawler";
import {
  getNotInSitemapsUrls,
  getSitemaps,
  getSitemapsUrls,
} from "../../../../utils/sitemaps";
import { initializeStatus } from "../../../../utils/status-manager";

export type AnalyzeResponseData = {
  message: string;
  sitemaps?: string[];
  sitemapsUrls?: string[];
  crawledUrls?: string[];
  notInSitemapsUrls?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeResponseData>,
) {
  // retrive domain query from request
  const { domain } = req.query;

  if (!domain) {
    res.status(400).json({ message: "Please provide a domain." });
    return;
  }

  if (Array.isArray(domain)) {
    res.status(400).json({ message: "Please provide a single domain." });
    return;
  }

  initializeStatus(domain);

  const sitemaps = await getSitemaps(domain);

  const sitemapsUrls = await getSitemapsUrls(sitemaps);

  const crawledUrls = await crawlUrls(domain, sitemapsUrls);

  const notInSitemapsUrls = getNotInSitemapsUrls(sitemapsUrls, crawledUrls);

  console.log(`Found ${notInSitemapsUrls.length} URLs not in sitemap.`);

  res.status(200).json({
    message: "Success",
    sitemaps,
    sitemapsUrls,
    crawledUrls,
    notInSitemapsUrls,
  });
}
