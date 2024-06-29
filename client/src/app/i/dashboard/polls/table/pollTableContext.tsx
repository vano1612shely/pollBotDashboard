import { createContext, useContext } from "react";

interface pollTableContextType {
  perPage: number;
  page: number;
  search: string;
  refetch: () => void;
}

export const PollTableContext = createContext<pollTableContextType>(null!);

export const usePollTableContext = () => {
  const props = useContext(PollTableContext);
  return props;
};
