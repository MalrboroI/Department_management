import { Modal, Button } from "react-bootstrap";
import "./ConfirmationModal.scss";

interface ConfirmationModalProps {
  show: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationModal = ({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Подтверждение",
  cancelText = "Отмена",
}: ConfirmationModalProps) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
