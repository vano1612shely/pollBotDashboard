import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useInfiniteQuery } from "@tanstack/react-query";
import buttonsService from "@/services/buttons.service";
import { ButtonType } from "@/types/button.type";
import { useCallback, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "@/app/i/dashboard/polls/create/components/messageSchema";
import { FormValues as FormV } from "@/app/i/dashboard/settings/components/startMessageSchema";
interface Page {
  data: { count: number; data: ButtonType[] };
  previousCursor?: number;
  nextCursor?: number;
}

const fetchData = async ({ pageParam = 0 }) => {
  return await buttonsService.getAll(10, pageParam);
};
export default function ButtonsPresets({
  form,
}: {
  form: UseFormReturn<FormValues | FormV>;
}) {
  const [open, setOpen] = useState(false);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["todos"],
    queryFn: ({ pageParam = 0 }) => fetchData({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  );
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-[200px]" type="button">
            Вибрати з пресетів
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <div className="button-list h-[300px] overflow-y-scroll flex flex-wrap gap-2">
              {data?.pages.map((page) => {
                return page.data.map((button, index) => {
                  return (
                    <div key={index} ref={lastElementRef}>
                      <Button
                        onClick={() => {
                          form.setValue("buttons", button.buttons);
                          setOpen(false);
                        }}
                      >
                        {button.name}
                      </Button>
                    </div>
                  );
                });
              })}
            </div>
            {isFetchingNextPage && <p>Loading more...</p>}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
