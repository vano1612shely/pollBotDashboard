"use client";
import { useQuery } from "@tanstack/react-query";
import clientService from "@/services/client.service";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserInfo from "@/app/i/dashboard/users/[id]/components/UserInfo";
import ResultTable from "@/app/i/dashboard/users/[id]/components/table/table";
import Chat from "@/app/i/dashboard/chat/components/Chat";

export default function UserPage({ params }: { params: { id: number } }) {
  const { data, isLoading } = useQuery({
    queryKey: ["user", params.id],
    queryFn: () => clientService.getById(Number(params.id)),
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
          <TabsTrigger value="poll_data">Відповіді</TabsTrigger>
          <TabsTrigger value="chat">Чат</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="p-2">
          <UserInfo user={data} />
        </TabsContent>
        <TabsContent value="poll_data" className="p-2">
          <ResultTable id={data.id} />
        </TabsContent>
        <TabsContent value="chat" className="p-2">
          <Chat client_id={data.id} />
        </TabsContent>
      </Tabs>
    </>
  );
}
