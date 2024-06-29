import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ButtonTable from "@/app/i/dashboard/buttons/table/table";

export default function ButtonsPage() {
  return (
    <>
      <div className="w-full flex justify-between items-center flex-wrap">
        <h1 className="text-3xl font-semibold">Кнопки</h1>
        <Link href="/i/dashboard/buttons/create">
          <Button className="flex gap-2 items-center">
            Створити новий блок кнопок <Plus />
          </Button>
        </Link>
      </div>
      <ButtonTable />
    </>
  );
}
