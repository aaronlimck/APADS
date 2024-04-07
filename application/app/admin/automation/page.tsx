import { getAutomation } from "@/actions/automation.action";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClockIcon, FileIcon } from "lucide-react";
import Link from "next/link";

export default async function AutomationPage() {
  const automations = await getAutomation();

  return (
    <main className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {automations.data.map((automation) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                {automation.name}
              </CardTitle>

              <CardDescription className="line-clamp-2">
                {automation.template.description}
              </CardDescription>

              <div className="flex items-center gap-2 pt-2 text-muted-foreground">
                <FileIcon size={16} />
                <Link
                  target="blank"
                  href={`/admin/appraisals/${automation.template.id}/builder?type=template`}
                >
                  <span className="truncate text-sm hover:text-primary hover:underline hover:underline-offset-1">
                    {automation.template.name}
                  </span>
                </Link>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ClockIcon size={16} />
                <span className="truncate text-sm">
                  Every {automation.frequency} months
                </span>
              </div>
            </CardHeader>
          </Card>
        ))}

        <div></div>
      </div>
    </main>
  );
}
