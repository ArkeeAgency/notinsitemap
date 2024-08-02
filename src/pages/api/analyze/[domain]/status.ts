import type { NextApiRequest, NextApiResponse } from "next";

import { getStatus, Status } from "../../../../utils/status-manager";

type StatusResponse =
  | {
      domain: string;
      totalUrls: number;
      crawledUrls: number;
      status: Status["status"];
    }
  | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>,
) {
  const { domain } = req.query;

  if (!domain) {
    res.status(400).json({ message: "Please provide a domain." });
    return;
  }

  if (Array.isArray(domain)) {
    res.status(400).json({ message: "Please provide a single domain." });
    return;
  }

  const status = getStatus(domain);

  if (status) {
    res.status(200).json(status);
  } else {
    res.status(404).json({ message: "No status found for the given domain." });
  }
}
