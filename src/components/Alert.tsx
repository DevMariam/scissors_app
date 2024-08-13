// components/Alert.js
import React from "react";
import styled from "styled-components";

const AlertContainer = styled.div<{ type: string; show: boolean }>`
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
  color: #fff;
  background-color: ${(props) =>
    props.type === "success" ? "#4CAF50" : "#F44336"};
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.6s;
  display: ${(props) => (props.show ? "block" : "none")};
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
`;

interface AlertProps {
  message: string;
  type: string;
  show: boolean;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  type = "error",
  show = true,
  onClose,
}) => {
  return (
    <AlertContainer type={type} show={show}>
      {message}
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </AlertContainer>
  );
};

export default Alert;
