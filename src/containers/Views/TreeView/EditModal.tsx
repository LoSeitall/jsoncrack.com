import React from "react";
import { Button, Divider, Group, Modal, TextInput } from "@mantine/core";
import _unset from "lodash.unset";
import _update from "lodash.update";
import useFile from "src/store/useFile";
import useJson from "src/store/useJson";

interface EditModalProps {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
  selectedValue: string | number | null;
  path: (string | number)[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const EditModal = ({
  opened,
  setOpened,
  selectedValue,
  path,
  value,
  setValue,
  errorMessage,
  setErrorMessage,
}: EditModalProps) => {
  const setContents = useFile(state => state.setContents);
  const getJson = useJson(state => state.getJson);

  return (
    <Modal centered title={selectedValue} opened={opened} onClose={() => setOpened(false)}>
      <TextInput
        value={value}
        onChange={e => {
          setValue(e.currentTarget.value);
        }}
        error={errorMessage}
      />
      <Divider my="md" />
      <Group justify="right">
        <Button
          color="red"
          onClick={() => {
            try {
              const updatedJson = JSON.parse(getJson());
              _unset(updatedJson, path);

              setContents({ contents: JSON.stringify(updatedJson, null, 2) });
              setErrorMessage(null);
              setOpened(false);
            } catch (error: any) {
              setErrorMessage(error.message);
            }
          }}
          rightSection={false}
        >
          Delete
        </Button>
        <Button
          onClick={() => {
            try {
              const updatedJson = _update(JSON.parse(getJson()), path, () => JSON.parse(value));
              setContents({ contents: JSON.stringify(updatedJson, null, 2) });

              setErrorMessage(null);
              setOpened(false);
            } catch (error: any) {
              setErrorMessage(error.message);
            }
          }}
          rightSection={false}
        >
          Apply
        </Button>
      </Group>
    </Modal>
  );
};
