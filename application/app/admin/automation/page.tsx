import { CreateAutomationBtn } from "@/components/automation/createAutomation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAutomation } from "@/actions/automation.action";

export default async function AutomationPage() {
  const automations = await getAutomation();

  return (
    <main className="space-y-6">
      <div className="grid grid-cols-2">
        {automations.data.map((automation) => (
          <div className="col-span-1 m-2" key={automation.id}>
            <Card>
              <CardHeader>
                <CardTitle>{automation.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {automation.template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5"></div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between"></CardFooter>
            </Card>
          </div>
        ))}

        <div></div>
      </div>
    </main>
  );
}
