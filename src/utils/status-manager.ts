// /utils/statusManager.ts

export type Status = {
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

export function initializeStatus(domain: string): void {
  statusMap[domain] = {
    domain,
    totalUrls: 0,
    crawledUrls: 0,
    status: "pending",
  };
}

export function updateStatus(
  domain: string,
  status: Status["status"],
  crawledUrls = 0,
  totalUrls = 0,
): void {
  if (statusMap[domain]) {
    statusMap[domain].crawledUrls = crawledUrls;
    statusMap[domain].status = status;
    statusMap[domain].totalUrls = totalUrls;
  }
}

export function getStatus(domain: string): Status | null {
  return statusMap[domain] || null;
}

export function resetStatus(domain: string): void {
  delete statusMap[domain];
}
