import { Box, Button, Flex, Input, Pagination } from "@mantine/core";
import PaginatedTable from "../components/PaginatedTable";
import DropzoneModal from "../components/DropzoneModal";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import React from "react";
import PacketDetailModal from "../components/PacketDetailModal";
import useGetPacketList from "../hooks/useGetPacketList";
import { useMutation } from "@tanstack/react-query";
import { postFlaggedPackets } from "../api";
import { useNavigate } from "react-router-dom";

const PacketList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = React.useState("");
  const [debounced] = useDebouncedValue(value, 500);
  const [page, setPage] = React.useState(0);
  const [packetId, setPacketDetailId] = React.useState();
  const [selectedRows, setSelectedRows] = React.useState<number[]>();
  const [flaggedPackets, setFlaggedPackets] = React.useState(false);

  const [detailOpened, { open: detailOpen, close: detailClose }] =
    useDisclosure(false);

  const navigate = useNavigate();

  const pageNumber = 12;

  const { data, refetch } = useGetPacketList({
    page,
    pageNumber,
    searchTerm: debounced,
  });

  const mutation = useMutation({
    mutationFn: (data: number[]) => {
      return postFlaggedPackets(data);
    },
    onSuccess: () => {
      navigate("/flaggedPackets");
    },
  });

  const packetDetail = data?.data.find(
    ({ id }: { id: number }) => id === packetId
  );

  return (
    <Flex direction="column">
      <Flex justify="flex-end" mb="40px">
        <Input
          placeholder="Search"
          size="md"
          radius="md"
          onChange={(event) => setValue(event.currentTarget.value)}
        />
        <Button
          variant="filled"
          size="md"
          ml="md"
          radius="md"
          onClick={() => {
            open();
          }}
        >
          Upload File (CSV/PCAP)
        </Button>
        {!flaggedPackets ? (
          <Button
            variant="filled"
            color="pink"
            size="md"
            ml="md"
            radius="md"
            onClick={() => {
              setFlaggedPackets(true);
            }}
          >
            Flag Packets
          </Button>
        ) : null}
      </Flex>
      <PaginatedTable
        rows={data?.data}
        open={detailOpen}
        flaggedPackets={flaggedPackets}
        selectedRows={selectedRows || []}
        setSelectedRows={setSelectedRows}
        setPacketDetail={setPacketDetailId}
      />
      <Flex justify="flex-end" mt="xl">
        {flaggedPackets ? (
          <Box>
            <Button
              variant="filled"
              size="sm"
              radius="sm"
              mr="sm"
              onClick={() => {
                mutation.mutate(selectedRows as number[]);
              }}
            >
              Submit
            </Button>
            <Button
              variant="filled"
              color="red"
              size="sm"
              mr="md"
              radius="sm"
              onClick={() => {
                setSelectedRows([]);
                setFlaggedPackets(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        ) : null}
        <Pagination
          total={data?.meta.pageCount}
          value={page}
          onChange={setPage}
        />
      </Flex>
      <DropzoneModal opened={opened} close={close} refetch={refetch} />
      {packetId ? (
        <PacketDetailModal
          opened={detailOpened}
          close={detailClose}
          packetDetail={packetDetail}
        />
      ) : null}
    </Flex>
  );
};

export default PacketList;
