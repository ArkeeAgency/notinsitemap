import {
  Button,
  Container,
  Fieldset,
  Icon,
  Link,
  Progress,
  Text,
  UnorderedList,
  useTheme,
} from "kitchn";
import { NextPage } from "next";
import Head from "next/head";
import { pathcat } from "pathcat";
import React from "react";
import { RiArrowLeftLine, RiStarFill, RiUploadLine } from "react-icons/ri";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import Footer from "../../components/footer";
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
  const [uuid, setUuid] = React.useState<string | null>();

  const { data, error, isLoading } = useSWRImmutable<AnalyzeResponseData>(
    uuid ? pathcat("/api/analyze/:domain", { domain, uuid }) : null,
    fetcher,
  );

  const { data: statusData } = useSWR(
    pathcat("/api/analyze/:domain/status", { domain, uuid }),
    fetcher,
    {
      refreshInterval: data ? 2000 : 250,
    },
  );

  React.useEffect(() => {
    if (statusData?.status !== uuid) {
      setUuid(statusData?.uuid);
    }
  }, [statusData, uuid]);

  if (isLoading || !data || statusData?.status !== "completed") {
    return (
      <Container h={"100vh"} align={"center"} justify={"center"}>
        <Head>
          <title>{`Analyzing ${domain}...`}</title>
        </Head>
        <Container w={"100%"} maxW={500} gap={"normal"} align={"center"}>
          <Text size={"large"} weight={"bold"} h1>
            {`Analyzing ${domain}...`}
          </Text>
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
          <Container align={"center"}>
            <Link href={"/"}>
              <Button
                prefix={<Icon icon={RiArrowLeftLine} color={"inherit"} />}
                type={"dark"}
              >
                {"Cancel"}
              </Button>
            </Link>
          </Container>
        </Container>
      </Container>
    );
  }

  // const { data, error, isLoading } = useSWRImmutable<AnalyzeResponseData>(
  //   `/api/analyze/${domain}`,
  //   fetcher,
  // );

  if (error) {
    return <Container>{"Error loading data"}</Container>;
  }

  console.log("data", data);

  return (
    <Container
      maxW={"laptop"}
      mx={"auto"}
      p={"normal"}
      minH={"100vh"}
      justify={"space-between"}
      align={"center"}
    >
      {" "}
      <Head>
        <title>{`${domain} Analysis`}</title>
      </Head>
      <Container w={"mobile"} flex={1} gap={"normal"} section>
        <Container justify={"space-between"} row>
          <Link href={"/"} type={"dark"}>
            <Button
              type={"dark"}
              prefix={<Icon icon={RiArrowLeftLine} color={"inherit"} />}
            >
              {"Back"}
            </Button>
          </Link>

          <Container row gap={"small"}>
            <Link href={"https://github.com/ArkeeAgency/notinsitemap"}>
              <Button
                type={"dark"}
                suffix={<Icon icon={RiStarFill} color={"inherit"} />}
              >
                {"Give us a star"}
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
      <Footer />
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
