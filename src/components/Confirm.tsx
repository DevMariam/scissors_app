import React from "react";
import styled from "styled-components";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  /* z-index: 1001; */
`;

const Transparent = styled(ModalContainer)`
  background-color: #6b4c4c;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px 20px;
  border-radius: 8px;
  width: 350px;
  text-align: center;
  height: 150px;
  display: flex;
  flex-direction: column;
  p {
    flex: 1;
  }

  h3 {
    margin-bottom: 20px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  .cancel {
    background: #ccc;
    color: #333;
  }

  .confirm {
    background: #ff6d63;
    color: #fff;
  }
`;

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  text?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
  text,
}) => {
  if (text) {
    return (
      <Transparent>
        <ModalContent>
          <p>{text}</p>
          <div className="buttons">
            <button className="cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="confirm" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </ModalContent>
      </Transparent>
    );
  }
  return (
    <ModalContainer>
      <ModalContent>
        <p>{text || "Are you sure you want to delete this link?"}</p>
        <div className="buttons">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </ModalContent>
    </ModalContainer>
  );
};

export default ConfirmationModal;
