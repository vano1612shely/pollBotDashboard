import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import PollTable from "@/app/i/dashboard/polls/table/pollTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PollInfo from "@/app/i/dashboard/polls/[id]/components/PollInfo";
import ResultTable from "@/app/i/dashboard/polls/[id]/components/resultsTable/table";

export default function PollPage() {
  return (
    <>
      <div className="w-full flex justify-between items-center flex-wrap">
        <h1 className="text-3xl font-semibold">Опитування</h1>
        <Link href="/i/dashboard/polls/create">
          <Button className="flex gap-2 items-center">
            Створити нове опитування <Plus />
          </Button>
        </Link>
      </div>
      <div>
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Активні</TabsTrigger>
            <TabsTrigger value="archived">Архівовані</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="p-2">
            <PollTable />
          </TabsContent>
          <TabsContent value="archived" className="p-2">
            <PollTable archived={true} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
