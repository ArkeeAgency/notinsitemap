import { Container, Text, Input, Button } from "kitchn";
import Head from "next/head";
import { useRouter } from "next/router";
import Balancer from "react-wrap-balancer";

const IndexPage = () => {
  const router = useRouter();

  const handleSubmission = (e) => {
    e.preventDefault();
    router.push(`/analyze/${e.target.domain.value}`);
  };

  return (
    <Container
      maxW={"laptop"}
      mx={"auto"}
      p={"normal"}
      h={"100vh"}
      justify={"center"}
      align={"center"}
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
      <Container maxW={"mobile"} mx={"auto"} py={"extraLarge"} section>
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
    </Container>
  );
};

export default IndexPage;
