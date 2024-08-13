import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";

import styled from "styled-components";

interface InputProp {
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  title: string;
  name: string;
  type?: string;
  showHideIcon?: boolean;
}

const Container = styled.div`
  .inner {
    margin-bottom: 10px;
    margin-top: 5px;
    display: flex;
    border: 1px solid #ff8888;
    padding: 7px 10px;
    border-radius: 6px;
    position: relative;
  }

  .icon {
    height: 22px;
    width: 22px;
  }

  .show-hide-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
    height: 22px;
    width: 22px;
  }

  input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
  }
`;

const Input: React.FC<InputProp> = ({
  icon,
  onChange,
  value,
  title,
  name,
  type = "text",
  showHideIcon,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container>
      <div className="inner sm-gap">
        <div className="icon center">{icon}</div>
        <div className="flex-1">
          <input
            name={name}
            placeholder={`Enter your ${title.toLowerCase()}`}
            value={value}
            onChange={onChange}
            type={type === "password" && showPassword ? "text" : type}
          />
        </div>

        {type === "password" && showHideIcon && (
          <div className="center icon" onClick={handleTogglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
        {/* <div className="icon center">{icon}</div> */}
      </div>
    </Container>
  );
};

export default Input;
