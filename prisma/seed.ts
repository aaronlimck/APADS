import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const HR = await prisma.user.upsert({
    where: { email: "manager@apads.com" },
    update: {},
    create: {
      email: "manager@apads.com",
      name: "Manager",
      password: "Password@888",
      role: "MANAGER"
    }
  });
  const manager = await prisma.user.upsert({
    where: { email: "hr@apads.com" },
    update: {},
    create: {
      email: "hr@apads.com",
      name: "HR",
      password: "Password@888",
      role: "ADMIN"
    }
  });
  const staff = await prisma.user.upsert({
    where: { email: "staff@apads.com" },
    update: {},
    create: {
      email: "staff@apads.com",
      name: "Staff",
      password: "Password@888",
      role: "STAFF"
    }
  });
  console.log({ HR, manager, staff });
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
