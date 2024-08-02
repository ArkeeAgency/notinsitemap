import { Container, Link, Text } from "kitchn";

export default function Footer() {
  return (
    <Container pt={"normal"} section>
      <Text align={"center"} size={"compact"} span>
        {"Fait avec ❤️ par "}
        <Link href={"https://arkee.fr"} variant={"blend"}>
          {"Arkée"}
        </Link>
        {" by "}
        <Link href={"https://jaws.group"} variant={"blend"}>
          {"Jaws"}
        </Link>
        {` © ${new Date().getFullYear()}`}
      </Text>
    </Container>
  );
}
