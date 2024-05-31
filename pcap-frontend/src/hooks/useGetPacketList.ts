import { useQuery } from "@tanstack/react-query";
import { fetchPackets } from "../api";

interface IProps {
  page?: number;
  pageNumber?: number;
  searchTerm?: string;
  isFlagged?: boolean;
}

const useGetPacketList = (props: IProps) => {
  const { page, pageNumber, searchTerm, isFlagged } = props;
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["packetList", page, pageNumber, searchTerm, isFlagged],
    queryFn: () =>
      fetchPackets(
        page || 0,
        pageNumber || 0,
        searchTerm || "",
        isFlagged || false
      ),
  });

  return {
    data,
    refetch,
    isLoading,
  };
};

export default useGetPacketList;
