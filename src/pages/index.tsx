import { Container, Text, Input, Button } from "kitchn";
import Head from "next/head";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";

import Footer from "../components/footer";
import { extractDomainFromUrl } from "../utils/domain";

const IndexPage = () => {
  const router = useRouter();

  const handleSubmission = (e) => {
    e.preventDefault();
    let value = e.target.domain.value;
    if (!value) return;
    if (value.startsWith("http://") || value.startsWith("https://")) {
      value = extractDomainFromUrl(value);
    }

    router.push(`/analyze/${value}`);
  };

  return (
    <Container
      maxW={"laptop"}
      mx={"auto"}
      p={"normal"}
      minH={"100vh"}
      justify={"space-between"}
    >
      <Head>
        <title>{"notinsitemap."}</title>
        <meta
          name={"description"}
          content={
            "What if we told you that some of your urls are not in your sitemap?"
          }
        />
      </Head>
      <Container
        maxW={"mobile"}
        mx={"auto"}
        py={"extraLarge"}
        flex={1}
        align={"center"}
        justify={"center"}
        section
      >
        <Container mt={"normal"} align={"center"}>
          <Text align={"center"} size={"title"} weight={"bold"} h1>
            {"notinsitemap."}
          </Text>
          <Balancer>
            <Text
              size={"medium"}
              mt={"normal"}
              weight={"medium"}
              align={"center"}
              color={"light"}
            >
              {
                "What if we told you that some of your urls are not in your sitemap?"
              }
            </Text>
          </Balancer>
        </Container>
        <Container
          justify={"center"}
          align={"center"}
          mt={"large"}
          gap={"small"}
          form
          onSubmit={handleSubmission}
          row
        >
          <Input name={"domain"} placeholder={"www.example.com"} width={300} />
          <Button htmlType={"submit"}>{"Analyze"}</Button>
        </Container>
      </Container>
      <Footer />
    </Container>
  );
};

export default IndexPage;
