import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
import { templateData } from "./performance_review_template";
import { createId } from "@paralleldrive/cuid2";
import { responses } from "./annual_performance_response";

async function createDepartment(name: string) {
  return prisma.department.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function createUser(
  email: string,
  name: string,
  password: string,
  role: Role,
  departmentName: string,
) {
  return prisma.$transaction(async (prisma) => {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password, role, departmentName },
    });

    return user;
  });
}

async function createAppraisalTemplate(
  name: string,
  description: string,
  content: string,
) {
  return prisma.$transaction(async (prisma) => {
    const template = await prisma.template.upsert({
      where: { name },
      update: {},
      create: { name, description, content },
    });
    return template;
  });
}

async function createAppraisal(
  id: string,
  name: string,
  description: string,
  content: string,
  isPublished: boolean,
  recipientsId: string[],
) {
  return prisma.$transaction(async (prisma) => {
    const appraisal = await prisma.appraisalForm.upsert({
      where: { id }, // use id as the unique identifier
      update: {},
      create: {
        name,
        description,
        content,
        isPublished,
        recipientsId: {
          connect: recipientsId.map((userId) => ({ id: userId })),
        },
      },
    });
    return appraisal;
  });
}

async function createAppraisalSubmission(
  id: string,
  content: string,
  formId: string,
  employeeId: string,
) {
  const submission = await prisma.appraisalSubmissions.upsert({
    where: { id },
    update: {},
    create: {
      id,
      content,
      formId,
      employeeId,
    },
  });
}

async function main() {
  const hrDepartment = await createDepartment("HUMAN RESOURCE");
  const financeDepartment = await createDepartment("FINANCE");
  const ITDepartment = await createDepartment("INFORMATION TECHNOLOGY");
  const marketingDepartment = await createDepartment("MARKETING");
  const testDepartment = await createDepartment("TEST");

  const HR = await createUser(
    "hr@apads.com",
    "HR1",
    "Password@888",
    "ADMIN",
    "HUMAN RESOURCE",
  );
  const ITManger = await createUser(
    "aaron.lim.2021@scis.smu.edu.sg",
    "Lim Cheng Kiat Aaron",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff1 = await createUser(
    "aaronlimchengkiat@gmail.com",
    "Lim Cheng Kiat Aaron (Google)",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff2 = await createUser(
    "aaronlimckdeveloper@gmail.com",
    "Lim Cheng Kiat Aaron (Developer)",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff3 = await createUser(
    "herman.tan.2021@scis.smu.edu.sg",
    "Herman Tan Jie Yang",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff4 = await createUser(
    "andrew.siew.2021@scis.smu.edu.sg",
    "Andrew Siew",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff5 = await createUser(
    "chiyong.tan.2021@scis.smu.edu.sg",
    "Tan Chi Yong",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const ITStaff6 = await createUser(
    "emilia.lim.2021@scis.smu.edu.sg",
    "Emilia Lim",
    "Password@888",
    "STAFF",
    "INFORMATION TECHNOLOGY",
  );
  const fianceManager = await createUser(
    "tanchiyong00@gmail.com",
    "Tan Chi Yong",
    "Password@888",
    "STAFF",
    "FINANCE",
  );
  const financeStaff = await createUser(
    "staff2@apads.com",
    "Staff2",
    "Password@888",
    "STAFF",
    "FINANCE",
  );

  // Create 30 test staff
  const users = [];
  for (let i = 0; i < 30; i++) {
    const user = await createUser(
      `testuser${i}@gmail.com`,
      `Test User ${i}`,
      `Password@${i}`,
      "STAFF",
      i % 3 === 0 ? "FINANCE" : "INFORMATION TECHNOLOGY",
    );
    users.push(user);
  }
  const baseTemplate = await createAppraisalTemplate(
    "Performance Excellence Review",
    "The Performance Insight Review (PIR) is a focused evaluation process that encourages employees to self-reflect on their achievements and growth areas. Managers provide valuable insights, fostering a collaborative discussion aimed at aligning individual performance with organizational goals. PIR emphasizes continuous improvement, skill enhancement, and mutual understanding, creating a pathway for ongoing success within our dynamic workplace.",
    JSON.stringify(templateData),
  );
  const recipientsIds = [ITStaff1.id, ITStaff2.id, ITStaff3.id];
  const userIds = recipientsIds.concat(users.map((user) => user.id));
  const appraisal = await createAppraisal(
    "clt18aq89000908lc0gn72i8t",
    "Annual Appraisal 2",
    "Annual Appraisal Description",
    JSON.stringify(templateData),
    true,
    userIds,
  );

  for (let i = 0; i < userIds.length; i++) {
    const content = JSON.stringify(responses[i]);
    const appraisalSubmission = await createAppraisalSubmission(
      createId(),
      content,
      appraisal.id,
      userIds[i],
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
