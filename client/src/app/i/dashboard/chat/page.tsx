import Chat from "@/app/i/dashboard/chat/components/Chat";
import ChatsList from "@/app/i/dashboard/chat/components/ChatsList";

export default function ChatPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return (
    <>
      <div className="flex gap-5">
        <div className="w-[400px]">
          <ChatsList />
        </div>
        <Chat client_id={Number(searchParams.id)} />
      </div>
    </>
  );
}
