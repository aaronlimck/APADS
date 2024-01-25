import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function createDepartment(name: string) {
  return prisma.department.upsert({
    where: { name },
    update: {},
    create: { name }
  });
}

async function createUser(
  email: string,
  name: string,
  password: string,
  role: Role,
  departmentName: string
) {
  return prisma.$transaction(async (prisma) => {
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name, password, role }
    });

    // Create a Staff record associated with the newly created user
    await prisma.staff.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, departmentName: departmentName }
    });

    return user;
  });
}
async function main() {
  const hrDepartment = await createDepartment("Human Resource");
  const financeDepartment = await createDepartment("Finance");
  const ITDepartment = await createDepartment("Information Technology");
  const marketingDepartment = await createDepartment("Marketing");

  const HR = await createUser(
    "hr@apads.com",
    "HR1",
    "Password@888",
    "ADMIN",
    "Human Resource"
  );
  const HR2 = await createUser(
    "hr2@apads.com",
    "HR2",
    "Password@888",
    "ADMIN",
    "Human Resource"
  );
  const manager = await createUser(
    "manager@apads.com",
    "Manager1",
    "Password@888",
    "MANAGER",
    "Finance"
  );
  const manager2 = await createUser(
    "manager2@apads.com",
    "Manager2",
    "Password@888",
    "MANAGER",
    "Finance"
  );
  const staff = await createUser(
    "staff@apads.com",
    "Staff",
    "Password@888",
    "STAFF",
    "Finance"
  );
  const staff2 = await createUser(
    "staff2@apads.com",
    "Staff2",
    "Password@888",
    "STAFF",
    "Finance"
  );
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
