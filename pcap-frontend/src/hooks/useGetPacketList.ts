import { useQuery } from "@tanstack/react-query";
import { fetchPackets } from "../api";

const useGetPacketList = (
  page?: number,
  pageNumber?: number,
  searchTerm?: string
) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["packetList", page, pageNumber, searchTerm],
    queryFn: () => fetchPackets(page || 0, pageNumber || 0, searchTerm || ""),
  });

  return {
    data,
    refetch,
    isLoading,
  };
};

export default useGetPacketList;
