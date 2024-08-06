import type { NextApiRequest, NextApiResponse } from "next";

import { crawlUrls } from "../../../../utils/crawler";
import {
  getNotInSitemapsUrls,
  getSitemaps,
  getSitemapsUrls,
} from "../../../../utils/sitemaps";
import {
  getStatus,
  resetStatus,
  updateStatus,
} from "../../../../utils/status-manager";

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
  const { domain, uuid } = req.query;

  if (!domain) {
    res.status(400).json({ message: "Please provide a domain." });
    return;
  }

  if (Array.isArray(domain)) {
    res.status(400).json({ message: "Please provide a single domain." });
    return;
  }

  if (!uuid) {
    res.status(400).json({
      message: "Please generate a uuid. `GET /api/analyze/[domain]/status`",
    });
    return;
  }

  if (Array.isArray(uuid)) {
    res.status(400).json({ message: "Please provide a single uuid." });
    return;
  }

  const handleClientDisconnect = () => {
    if (getStatus(domain, uuid)?.status !== "completed") {
      console.log(
        `Client disconnected. Resetting status for ${domain}@${uuid}.`,
      );

      resetStatus(uuid);
    }
  };

  res.on("close", handleClientDisconnect);

  const sitemaps = await getSitemaps(domain);

  updateStatus(uuid, "get-sitemaps");

  const sitemapsUrls = await getSitemapsUrls(sitemaps);

  updateStatus(uuid, "get-sitemaps-urls");

  const crawledUrls = await crawlUrls(uuid, sitemapsUrls);

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
