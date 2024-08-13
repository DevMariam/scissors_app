import { useEffect, useState } from "react";

import axios from "axios";
import styled from "styled-components";
import { useUser } from "../store/useUser";

// Define types for user data
interface User {
  username: string;
  email: string;
}

// Styled components for the layout and styling
const Container = styled.div`
  padding: 50px 30px;

  h2 {
    @media screen and (max-width: 400px) {
      font-size: 20px;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 50px 10px;
  }
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  background-color: #fbe4e4;
  padding: 10px;
  border-radius: 10px;
  width: 30%;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  height: 100px;

  h3 {
    font-size: 40px;
  }

  p {
    font-size: 14px;
  }

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Overview = styled.div`
  display: flex;
  margin-top: 30px;
`;

// Define the structure of the expected API response
interface LinkCountResponse {
  userLinkCount: number;
}

const Dashboard: React.FC = () => {
  const [linkCount, setLinkCount] = useState<number>(0);
  const token = localStorage.getItem("token");

  const { user: storeUser } = useUser();

  // Fallback to local storage if user is not available from store
  const user: User | null =
    storeUser || JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchLinkCount = async () => {
      try {
        const response = await axios.get<LinkCountResponse>(
          "https://sl-lk.onrender.com/api/v1/all/count",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Ensure you have user token
            },
          }
        );
        setLinkCount(response.data.userLinkCount);
      } catch (error) {
        console.error("Error fetching link count:", error);
      }
    };

    if (token) {
      fetchLinkCount();
    }
  }, [token]);

  return (
    <Container>
      <h2>Welcome {user?.username}.</h2>

      <Overview>
        <OverviewItem>
          <h3>{linkCount}</h3>
          <p>Total Links</p>
        </OverviewItem>
      </Overview>
    </Container>
  );
};

export default Dashboard;
