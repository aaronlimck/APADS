import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface GithubAccessTokenEmailProps {
  name: string;
  appraisalId: string;
}

const baseUrl = `${process.env.NEXTAUTH_URL}`;

export const SelfEvaluation = ({
  name,
  appraisalId,
}: GithubAccessTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>Self-Evaluation Appraisal Assigned - Action Required</Preview>
    <Body style={main}>
      <Text style={heading}>APADS</Text>
      <Container style={container}>
        <Text style={text}>
          Dear <strong>{name}</strong>!
        </Text>
        <Text style={text}>
          You have been assigned a self-evaluation appraisal. To complete it,
          kindly log in to your account or click the button below:
        </Text>
        <Button style={button} href={`${baseUrl}/appraisal/${appraisalId}`}>
          Self-Eval
        </Button>
      </Container>
    </Body>
  </Html>
);

export default SelfEvaluation;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const heading = {
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 10px 0",
  textAlign: "left" as const,
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};
