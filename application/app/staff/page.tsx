import { getUserById } from "@/actions/user.action";
import { authConfig } from "@/auth.config";
import ApprisalItem, {
  ApprisalItemEmptyState,
  ApprisalItemSkeleton,
} from "@/components/appraisal/apprisial-item";
import GoalCard, { GoalCardSkeleton } from "@/components/card/goal-card";
import { GoalModalTrigger } from "@/components/modal/goal-modal";
import { Card } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import { Suspense } from "react";

export default async function StaffPage() {
  const session = await getServerSession(authConfig);
  const userName = session?.user.name;

  const userData = await getUserById(session?.user.id!);
  return (
    <main className="mx-auto my-6 w-full max-w-7xl space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Welcome back, {userName}</h1>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <Card className="h-fit space-y-3 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className="font-medium">Your Goals</div>
            <GoalModalTrigger>
              <div className="cursor-pointer text-sm text-muted-foreground hover:underline">
                Add
              </div>
            </GoalModalTrigger>
          </div>

          <div className="space-y-2">
            <Suspense
              fallback={[1, 2, 3].map((el) => (
                <GoalCardSkeleton key={el} />
              ))}
            >
              {userData.data?.goals?.length! > 0 ? (
                <>
                  {userData.data?.goals?.map((item) => {
                    return <GoalCard key={item.id} data={item} />;
                  })}
                </>
              ) : (
                <div className="text-sm text-muted-foreground">
                  You have not set-up your goals
                </div>
              )}
            </Suspense>
          </div>
        </Card>

        <Card className="h-fit space-y-3 p-4 lg:col-span-2 lg:p-6">
          <div className="font-medium">Self-Appraisal</div>

          <div className="space-y-2">
            <Suspense
              fallback={[1, 2, 3].map((el) => (
                <ApprisalItemSkeleton key={el} />
              ))}
            >
              {userData.data?.appraisals?.length! > 0 ? (
                <>
                  {userData.data?.appraisals.map((item) => {
                    return (
                      <ApprisalItem
                        key={item.id}
                        data={item}
                        userId={session?.user.id!}
                      />
                    );
                  })}
                </>
              ) : (
                <ApprisalItemEmptyState />
              )}
            </Suspense>
          </div>
        </Card>
      </div>
    </main>
  );
}
