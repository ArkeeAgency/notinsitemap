import {
  Button,
  Container,
  Fieldset,
  Icon,
  Link,
  Progress,
  UnorderedList,
  useTheme,
} from "kitchn";
import { NextPage } from "next";
import { RiArrowLeftLine, RiUploadLine } from "react-icons/ri";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import { fetcher } from "../../services/swr";
import { Status } from "../../utils/status-manager";
import { AnalyzeResponseData } from "../api/analyze/[domain]";

export type AnalyzePageProps = {
  domain: string;
};

const StatusValueMap: { [key in Status["status"]]: number } = {
  pending: 0,
  "get-sitemaps": 1,
  "get-sitemaps-urls": 2,
  crawling: 3,
  completed: 4,
};

const AnalyzePage: NextPage<AnalyzePageProps> = ({
  domain,
}: AnalyzePageProps) => {
  const { theme } = useTheme();
  const { data, error, isLoading } = useSWRImmutable<AnalyzeResponseData>(
    `/api/analyze/${domain}`,
    fetcher,
  );

  const { data: statusData } = useSWR(
    `/api/analyze/${domain}/status`,
    fetcher,
    {
      refreshInterval: 500,
    },
  );

  console.log("status", statusData);

  if (error) {
    return <Container>{"Error loading data"}</Container>;
  }

  // if (true) {
  if (isLoading || !data || statusData?.status !== "completed") {
    return (
      <Container h={"100vh"} align={"center"} justify={"center"}>
        <Container w={"100%"} maxW={500}>
          <Progress
            value={StatusValueMap[statusData?.status || "pending"]}
            colors={{
              0: theme.colors.accent.info,
              1: theme.colors.accent.info,
              2: theme.colors.accent.info,
              3: theme.colors.accent.warning,
              4: theme.colors.accent.success,
            }}
            states={{
              0: "Pending",
              1: "Getting sitemaps",
              2: "Getting sitemap URLs",
              3: `Crawling (${statusData?.crawledUrls || 0}/${
                statusData?.totalUrls || 0
              })`,
              4: "Completed",
            }}
            max={4}
            checkpointTitle={false}
            checkpointStyle={"bar"}
          />
        </Container>
      </Container>
    );
  }

  console.log("data", data);

  return (
    <Container
      mx={"auto"}
      maxW={"mobile"}
      py={"large"}
      px={"normal"}
      gap={"small"}
    >
      <Container justify={"space-between"} row>
        <Link href={"/"} type={"dark"}>
          <Button
            type={"dark"}
            prefix={<Icon icon={RiArrowLeftLine} color={"inherit"} />}
          >
            {"Back"}
          </Button>
        </Link>

        <Button
          type={"dark"}
          suffix={<Icon icon={RiUploadLine} color={"inherit"} />}
          disabled
        >
          {"Export"}
        </Button>
      </Container>

      <Fieldset.Container>
        <Fieldset.Content>
          <Fieldset.Title>{"Sitemaps"}</Fieldset.Title>

          <Fieldset.Subtitle>
            {data.sitemaps && (
              <>
                {"Found "}
                {data.sitemaps.length}
                {" sitemaps."}
                <UnorderedList>
                  {data.sitemaps.map((sitemap, index) => (
                    <li key={index}>{sitemap}</li>
                  ))}
                </UnorderedList>
              </>
            )}
          </Fieldset.Subtitle>
        </Fieldset.Content>
      </Fieldset.Container>

      <Fieldset.Container>
        <Fieldset.Content>
          <Fieldset.Title>{"Sitemap URLs"}</Fieldset.Title>

          <Fieldset.Subtitle>
            {data.sitemapsUrls && (
              <>
                {"Found "}
                {data.sitemapsUrls.length}
                {" URLs in sitemaps."}
                {/* <UnorderedList>
                  {data.sitemapsUrls.map((url, index) => (
                    <li key={index}>{url}</li>
                  ))}
                </UnorderedList> */}
              </>
            )}
          </Fieldset.Subtitle>
        </Fieldset.Content>
      </Fieldset.Container>

      <Fieldset.Container>
        <Fieldset.Content>
          <Fieldset.Title>{"Crawled URLs"}</Fieldset.Title>

          <Fieldset.Subtitle>
            {data.crawledUrls && (
              <>
                {"Crawled "}
                {data.crawledUrls.length}
                {" URLs."}
                {/* <UnorderedList>
                  {data.crawledUrls.map((url, index) => (
                    <li key={index}>{url}</li>
                  ))}
                </UnorderedList> */}
              </>
            )}
          </Fieldset.Subtitle>
        </Fieldset.Content>
      </Fieldset.Container>

      <Fieldset.Container>
        <Fieldset.Content>
          <Fieldset.Title>{"Not in Sitemaps URLs"}</Fieldset.Title>

          <Fieldset.Subtitle>
            {data.notInSitemapsUrls && (
              <>
                {"Found "}
                {data.notInSitemapsUrls.length}
                {" URLs not in sitemaps."}
                <UnorderedList>
                  {data.notInSitemapsUrls.map((url, index) => (
                    <li key={index}>
                      <Link href={url}>{url}</Link>
                    </li>
                  ))}
                </UnorderedList>
              </>
            )}
          </Fieldset.Subtitle>
        </Fieldset.Content>
      </Fieldset.Container>
    </Container>
  );
};

AnalyzePage.getInitialProps = async ({ query }) => {
  const { domain } = query;

  if (!domain) {
    throw new Error("Please provide a domain.");
  }

  if (Array.isArray(domain)) {
    throw new Error("Please provide a single domain.");
  }

  return {
    domain,
  };
};

export default AnalyzePage;
