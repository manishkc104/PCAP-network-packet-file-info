import { Button, Flex, Group, Modal, Text, rem } from "@mantine/core";
import { Dropzone, FileWithPath, MIME_TYPES } from "@mantine/dropzone";
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconFileTypeCsv,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { uploadFile } from "../api";
import React from "react";

interface IProps {
  opened: boolean;
  close: () => void;
  refetch: any;
}

const DropzoneModal = ({ opened, close, refetch }: IProps) => {
  const [fileInfo, setFileInfo] = React.useState<FileWithPath>();

  const handleSubmit = () => {
    uploadFile(fileInfo as FileWithPath).then(() => {
      notifications.show({
        id: "hello-there",
        withCloseButton: true,
        autoClose: 1000,
        title: "File Accepted",
        message: "The CSV file has been successfully uploaded",
        className: "my-notification-class",
        color: "green",
      });
      setFileInfo(undefined);
      close();
      refetch();
    });
  };
  return (
    <Modal opened={opened} onClose={close} title="Upload the CSV" padding={40}>
      <Dropzone
        onDrop={(file) => {
          const fileInfo = file[0];
          setFileInfo(fileInfo);
        }}
        onReject={() => {
          notifications.show({
            id: "hello-there",
            withCloseButton: true,
            autoClose: 5000,
            title: "File Rejected",
            message: "Please select the correct file type",
            className: "my-notification-class",
            color: "red",
          });
        }}
        maxSize={5 * 1024 ** 2}
        accept={[MIME_TYPES.csv]}
      >
        <Group
          justify="center"
          gap="xl"
          mih={150}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="md" inline>
              Drag csv files here or click to select files
            </Text>
          </div>
        </Group>
      </Dropzone>
      {fileInfo ? (
        <Flex
          p={10}
          mt="md"
          style={{ border: "1px solid grey", borderRadius: "0.4rem" }}
          align="center"
          justify="space-between"
        >
          <Flex>
            <IconFileTypeCsv
              style={{
                width: rem(25),
                height: rem(25),
              }}
              stroke={1.5}
            />
            <Flex direction="column" ml={4}>
              <Text size="xs">{fileInfo?.name}</Text>
              <Text size="xs">{fileInfo?.size}</Text>
            </Flex>
          </Flex>
          <Flex>
            <Button
              variant="filled"
              color="red"
              size="xs"
              p="0"
              w={20}
              h={20}
              justify="end"
              onClick={() => setFileInfo(undefined)}
            >
              <IconX
                style={{
                  width: rem(25),
                  height: rem(25),
                }}
                stroke={1.5}
              />
            </Button>
          </Flex>
        </Flex>
      ) : null}

      <Flex justify="flex-end">
        <Button
          variant="filled"
          size="md"
          radius="md"
          mt="md"
          onClick={handleSubmit}
          disabled={!fileInfo}
        >
          Submit
        </Button>
      </Flex>
    </Modal>
  );
};

export default DropzoneModal;
