import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NewEmailProps {
  username: string;
  email: string;
  password: string;
}

const baseUrl = process.env.NEXTAUTH_URL
  ? `https://${process.env.NEXTAUTH_URL}`
  : "";

export const NewAccountEmail = ({
  username,
  email,
  password,
}: NewEmailProps) => (
  <Html>
    <Head />
    <Preview>
      The sales intelligence platform that helps you uncover qualified leads.
    </Preview>

    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>APADS</Text>
        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          Welcome to Autonomous Appraisal and Performance System (APADS) – a
          cutting-edge proof of concept product designed to digitalize and
          automate the appraisal process. Our vision is to evolve this system
          into an autonomous solution as more datasets become available,
          revolutionizing the way performance assessments are conducted.
        </Text>

        <Text style={paragraph}>Below are your login details:</Text>
        <Text style={paragraph}>
          <strong>Username:</strong> {email}
          <br />
          <strong>Password:</strong> {password}
        </Text>
        <Text style={paragraph}>
          Please remember to keep your login credentials confidential and do not
          share them with anyone for security reasons.
        </Text>

        <Section style={btnContainer}>
          <Button style={button} href={`${baseUrl}/login`}>
            Login
          </Button>
        </Section>

        <Text style={paragraph}>
          Best,
          <br />
          APADS Development Team
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewAccountEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const heading = {
  fontSize: "20px",
  lineHeight: "28px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#5F51E8",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};
