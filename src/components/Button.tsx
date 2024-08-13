import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const Container = styled.button`
  width: 100%;
  background: #ff6d63;
  outline: none;
  border: none;
  padding: 10px;
  border-radius: 3px;
  cursor: pointer;
  color: #fff;
  font-size: 17px;
  margin-top: 30px;

  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(2px);
  }
`;

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default Button;
