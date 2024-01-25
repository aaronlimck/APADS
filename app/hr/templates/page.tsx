import CreateTemplateBtn from "@/components/CreateTemplateBtn";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { GetTemplates } from "@/actions/template";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Suspense } from "react";
// import { LuView } from "react-icons/lu";
// import { FaWpforms } from "react-icons/fa";
// import { HiCursorClick } from "react-icons/hi";
// import { TbArrowBounce } from "react-icons/tb";
import { Template } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";

export default function TemplatesPage() {
  
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 md:px-6 py-4">
      <h1 className="text-3xl font-semibold tracking-tight select-none">
        Your Templates
      </h1>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateTemplateBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <TemplateCardSkeleton key={el} />
          ))}
        >
          <TemplateCards />
        </Suspense>
      </div>
    </div>
  );
}

function TemplateCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

async function TemplateCards() {
  const forms = await GetTemplates();
  return (
    <>
      {forms.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </>
  );
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold pb-1">{template.name}</span>
          {template.published && <Badge>Published</Badge>}
          {!template.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(template.createdAt, new Date(), {
            addSuffix: true
          })}
          {/* {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )} */}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {template.description || "No description"}
      </CardContent>
      <CardFooter>
        {template.published && (
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${template.id}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!template.published && (
          <Button
            asChild
            variant={"secondary"}
            className="w-full mt-2 text-md gap-4"
          >
            <Link href={`/hr/builder/${template.id}`}>
              Edit form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}