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
  employeeName: string;
  managerName: string;
  formId: string;
  employeeResponseFormId: string;
  employeeId: string;
  managerId: string;
}

const baseUrl = `${process.env.NEXTAUTH_URL}`;

export const ManagerEvaluation = ({
  employeeName,
  managerName,
  formId,
  employeeResponseFormId,
  employeeId,
  managerId,
}: GithubAccessTokenEmailProps) => (
  <Html>
    <Head />
    <Preview>
      Action Required: Complete Evaluation Appraisal for {employeeName}
    </Preview>
    <Body style={main}>
      <Text style={heading}>APADS</Text>
      <Container style={container}>
        <Text style={text}>Dear {managerName},</Text>
        <Text style={text}>
          <strong>{employeeName}</strong>, has completed their self-evaluation
          appraisal. Now, it's your turn to provide your assessment.
        </Text>
        <Button
          style={button}
          href={`${baseUrl}/appraisal/${formId}?employeeResponseFormId=${employeeResponseFormId}&employeeId=${employeeId}&managerId=${managerId}`}
        >
          Evaluate Now
        </Button>
      </Container>
    </Body>
  </Html>
);

export default ManagerEvaluation;

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
