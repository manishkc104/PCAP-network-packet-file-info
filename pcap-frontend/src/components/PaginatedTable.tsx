import { Button, Checkbox, Table } from "@mantine/core";
import { Dispatch, SetStateAction } from "react";

interface IProps {
  rows: any;
  open: () => void;
  setPacketDetail: Dispatch<SetStateAction<undefined>>;
  setSelectedRows: (value: number[]) => void;
  selectedRows: number[];
  flaggedPackets: boolean;
}

const PaginatedTable = (props: IProps) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>SN</Table.Th>
          <Table.Th>Time</Table.Th>
          <Table.Th>Source</Table.Th>
          <Table.Th>Destination</Table.Th>
          <Table.Th>Protocol</Table.Th>
          <Table.Th>Length</Table.Th>
          <Table.Th></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {props?.rows?.map((element: any) => (
          <Table.Tr key={element.id}>
            {props.flaggedPackets ? (
              <Table.Td>
                <Checkbox
                  aria-label="Select Row"
                  onChange={(event) =>
                    props.setSelectedRows(
                      event.currentTarget.checked
                        ? [...props.selectedRows, element.id]
                        : props.selectedRows.filter((id) => id !== element.id)
                    )
                  }
                />
              </Table.Td>
            ) : null}
            <Table.Td>{element.id}</Table.Td>
            <Table.Td>{element.time}</Table.Td>
            <Table.Td>{element.source}</Table.Td>
            <Table.Td>{element.destination}</Table.Td>
            <Table.Td>{element.protocol}</Table.Td>
            <Table.Td>{element.length}</Table.Td>
            <Table.Td>
              <Button
                variant="filled"
                color="teal"
                onClick={() => {
                  props.setPacketDetail(element.id);
                  props.open();
                }}
              >
                Detail
              </Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default PaginatedTable;
