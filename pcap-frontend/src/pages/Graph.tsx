import { Box, Loader } from "@mantine/core";
import Cytoscape from "../components/Cytoscape";
import useGetPacketList from "../hooks/useGetPacketList";
import React from "react";

const Graph = () => {
  const { data, isLoading } = useGetPacketList({});
  const [transformedData, setTransformedData] = React.useState([]);

  React.useEffect(() => {
    if (data?.data) {
      const uniqueNodes = new Set();
      const edges = [];

      data?.data?.forEach((packet) => {
        uniqueNodes.add(packet.source);
        uniqueNodes.add(packet.destination);
        edges.push({
          data: {
            id: `${packet.source}${packet.destination}`,
            source: packet.source,
            target: packet.destination,
          },
        });
      });

      const nodes = Array.from(uniqueNodes).map((node) => ({
        data: { id: node },
      }));

      setTransformedData([...nodes, ...edges]);
    }
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <Box h="calc(100vh - 91px)">
      {transformedData.length > 0 ? (
        <Cytoscape formattedElements={transformedData} />
      ) : null}
    </Box>
  );
};

export default Graph;
