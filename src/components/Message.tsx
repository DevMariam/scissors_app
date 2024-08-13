import React from "react";
import styled from "styled-components";

interface MessageDisplayProps {
  message: string;
  type: "success" | "error"; // Only success and error types
}

const MessageContainer = styled.div<{ type: "success" | "error" }>`
  padding: 15px;
  margin: 20px 0;
  min-width: fit-content;
  border-radius: 4px;
  color: #fff;
  background-color: ${(props) =>
    props.type === "success" ? "#61a063" : "#F44336"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  @media (max-width: 400px) {
    width: 100%;
  }
`;

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message, type }) => {
  if (!message) return null; // Don't render if there's no message

  return <MessageContainer type={type}>{message}</MessageContainer>;
};

export default MessageDisplay;
