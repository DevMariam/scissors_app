import styled, { keyframes } from "styled-components";

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(242, 234, 234, 0.8);
  z-index: 99;
`;

// Define the animation for the spinner
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Style the spinner
const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #d55555;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const Loading = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spinner />
    </Container>
  );
};

export default Loading;
