import React, { ReactNode } from "react";

import Sidebar from "./Sidebar";
import styled from "styled-components";

interface MainProps {
  children: ReactNode;
}

const Background = styled.div`
  background-color: #fcecec;
  display: flex;
  min-height: 100vh;
`;

const MainContainer = styled.div`
  /* padding: 10px; */
  width: 100%;
  @media screen and (max-width: 768px) {
    width: calc(100% - 70px);
    position: relative;
    z-index: 97;
    left: 70px;
  }
`;

const Main: React.FC<MainProps> = ({ children }) => {
  return (
    <Background>
      <Sidebar />
      <MainContainer>{children}</MainContainer>
    </Background>
  );
};

export default Main;
