"use server";

import prisma from "@/lib/prisma";
import { templateSchema, formSchemaType } from "@/schemas/form";
// import { getServerSession } from "next-auth";
// import { authConfig } from "@/lib/auth.config";

// import { currentUser } from "@clerk/nextjs";

// class UserNotFoundErr extends Error {}

// export async function GetFormStats() {
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   const stats = await prisma.form.aggregate({
//     where: {
//       userId: user.id
//     },
//     _sum: {
//       visits: true,
//       submissions: true
//     }
//   });

//   const visits = stats._sum.visits || 0;
//   const submissions = stats._sum.submissions || 0;

//   let submissionRate = 0;

//   if (visits > 0) {
//     submissionRate = (submissions / visits) * 100;
//   }

//   const bounceRate = 100 - submissionRate;

//   return {
//     visits,
//     submissions,
//     submissionRate,
//     bounceRate
//   };
// }

export async function CreateTemplate(data: formSchemaType) {
  const validation = templateSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("Template not valid");
  }

  // const session = await getServerSession(authConfig);
  // console.log(session?.user);

  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  const { name, description } = data;

  const form = await prisma.template.create({
    data: {
      userId: "12345678", //to change
      name,
      description
    }
  });

  if (!form) {
    throw new Error("something went wrong");
  }

  return form.id;
}

export async function GetTemplates() {
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  return await prisma.template.findMany({
    where: {
      userId: "12345678" //to change
    },
    orderBy: {
      createdAt: "desc"
    }
  });
}

export async function GetTemplateById(id: number) {
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  return await prisma.template.findUnique({
    where: {
      // to replace
      userId: "12345678",
      id
    }
  });
}

export async function UpdateTemplateContent(id: number, jsonContent: string) {
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  return await prisma.template.update({
    where: {
      userId: "12345678", //to change
      id
    },
    data: {
      content: jsonContent
    }
  });
}

export async function PublishTemplate(id: number) {
  // const user = await currentUser();
  // if (!user) {
  //   throw new UserNotFoundErr();
  // }

  return await prisma.template.update({
    data: {
      published: true
    },
    where: {
      userId: "12345678", //to change
      id
    }
  });
}

// export async function GetFormContentByUrl(formUrl: string) {
//   return await prisma.form.update({
//     select: {
//       content: true
//     },
//     data: {
//       visits: {
//         increment: 1
//       }
//     },
//     where: {
//       shareURL: formUrl
//     }
//   });
// }

// export async function SubmitForm(formUrl: string, content: string) {
//   return await prisma.form.update({
//     data: {
//       submissions: {
//         increment: 1
//       },
//       FormSubmissions: {
//         create: {
//           content
//         }
//       }
//     },
//     where: {
//       shareURL: formUrl,
//       published: true
//     }
//   });
// }

// export async function GetFormWithSubmissions(id: number) {
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   return await prisma.form.findUnique({
//     where: {
//       userId: user.id,
//       id
//     },
//     include: {
//       FormSubmissions: true
//     }
//   });
// }
