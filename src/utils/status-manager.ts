// /utils/status-manager.ts
import { v4 as uuidv4 } from "uuid";

export type Status = {
  uuid: string;
  domain: string;
  totalUrls: number;
  crawledUrls: number;
  status:
    | "pending"
    | "get-sitemaps"
    | "get-sitemaps-urls"
    | "crawling"
    | "completed";
};

const statusMap: { [key: string]: Status } = {};

export function initializeStatus(domain: string): string {
  const uuid = uuidv4();
  statusMap[uuid] = {
    uuid,
    domain,
    totalUrls: 0,
    crawledUrls: 0,
    status: "pending",
  };
  return uuid;
}

export function updateStatus(
  uuid: string,
  status: Status["status"],
  crawledUrls = 0,
  totalUrls = 0,
): void {
  if (statusMap[uuid]) {
    statusMap[uuid].crawledUrls = crawledUrls;
    statusMap[uuid].status = status;
    statusMap[uuid].totalUrls = totalUrls;
  }
}

export function getStatus(domain: string, uuid?: string): Status {
  if (uuid) {
    return statusMap[uuid];
  } else {
    const newUuid = initializeStatus(domain);
    return statusMap[newUuid];
  }
}

export function resetStatus(uuid: string): void {
  delete statusMap[uuid];
}
