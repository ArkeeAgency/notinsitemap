import type { NextApiRequest, NextApiResponse } from "next";

import { getStatus, Status } from "../../../../utils/status-manager";

type StatusResponse = Status | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse>,
) {
  const { domain, uuid } = req.query;

  if (!domain) {
    res.status(400).json({ message: "Please provide a domain." });
    return;
  }

  if (Array.isArray(domain)) {
    res.status(400).json({ message: "Please provide a single domain." });
    return;
  }

  if (Array.isArray(uuid)) {
    res.status(400).json({ message: "Please provide a single uuid." });
    return;
  }

  const status = getStatus(domain, uuid);

  if (status) {
    res.status(200).json(status);
  } else {
    res.status(404).json({ message: "No status found for the given domain." });
  }
}
