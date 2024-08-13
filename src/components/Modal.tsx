import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  background: #ffffff85;
  inset: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* z-index: 1; */
  .inner {
    background: #ffffff;
    width: 600px; /* Adjust the width as needed */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

interface ModalProps {
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <Container>
      <div className="inner">{children}</div>
    </Container>
  );
};

export default Modal;
