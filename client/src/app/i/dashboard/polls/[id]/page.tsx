"use client";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import PollInfo from "@/app/i/dashboard/polls/[id]/components/PollInfo";
import ResultTable from "@/app/i/dashboard/polls/[id]/components/resultsTable/table";
import { useQuery } from "@tanstack/react-query";
import messageService from "@/services/message.service";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
export default function PollPage({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["message", Number(params.id)],
    queryFn: () => messageService.getById(params.id),
  });
  useEffect(() => {
    if (!isLoading && !data) {
      redirect("/i/dashboard/polls");
    }
  }, [data]);
  if (!data) {
    return (
      <div className="flex w-full h-full">
        <Loader2 className="w-32 h-32 animate-spin m-auto" />
      </div>
    );
  }
  return (
    <>
      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Інформація</TabsTrigger>
          <TabsTrigger value="users_data">Вибір користувачів</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="p-2">
          <PollInfo data={data} />
        </TabsContent>
        <TabsContent value="users_data" className="p-2">
          <ResultTable id={params.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
