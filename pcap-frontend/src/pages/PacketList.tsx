import { Button, Flex, Input, Pagination } from "@mantine/core";
import PaginatedTable from "../components/PaginatedTable";
import DropzoneModal from "../components/DropzoneModal";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import React from "react";
import PacketDetailModal from "../components/PacketDetailModal";
import useGetPacketList from "../hooks/useGetPacketList";

const PacketList = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = React.useState("");
  const [debounced] = useDebouncedValue(value, 500);
  const [page, setPage] = React.useState(0);
  const [packetId, setPacketDetailId] = React.useState();

  const [detailOpened, { open: detailOpen, close: detailClose }] =
    useDisclosure(false);

  const pageNumber = 15;

  const { data, refetch } = useGetPacketList(page, pageNumber, debounced);

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
          Upload CSV
        </Button>
      </Flex>
      <PaginatedTable
        rows={data?.data}
        open={detailOpen}
        setPacketDetail={setPacketDetailId}
      />
      <Flex justify="flex-end" mt="lg">
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
