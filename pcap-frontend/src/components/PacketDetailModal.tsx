import { Box, Flex, Modal, Text } from "@mantine/core";
import Cytoscape from "./Cytoscape";

interface IProps {
  opened: boolean;
  close: () => void;
  packetDetail: any;
}

const PacketDetailModal = ({ opened, close, packetDetail }: IProps) => {
  const elements = [
    { data: { id: packetDetail?.source } },
    { data: { id: packetDetail?.destination } },
    {
      data: {
        id: `${packetDetail?.source}${packetDetail?.destination}`,
        source: packetDetail?.source,
        target: packetDetail?.destination,
      },
    },
  ];

  return (
    <Modal opened={opened} onClose={close} title="Packet Details" padding={40}>
      <Box h="100px">
        <Cytoscape formattedElements={elements} />
      </Box>
      <Flex mt="lg">
        <Text fw={500}>Info:&nbsp;</Text>
        <Text>{packetDetail?.info}</Text>
      </Flex>
    </Modal>
  );
};

export default PacketDetailModal;
