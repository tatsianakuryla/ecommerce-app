import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
interface JustRegisteredDialogProperties {
  title: string;
  description: string;
  handleCloseDialog: () => void;
}

export const JustRegisteredDialog = ({
  title,
  description,
  handleCloseDialog,
}: JustRegisteredDialogProperties) => {
  return (
    <Dialog.Root open={true} onOpenChange={handleCloseDialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body fontSize='md'>
              <p>{description}</p>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size='md'>Close</CloseButton>
              </Dialog.CloseTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
