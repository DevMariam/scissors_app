import React, { useState } from "react";

import { FaAngleDown } from "react-icons/fa6";
import Loading from "./Loading";
import MessageDisplay from "./Message";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 80px;
  input {
    width: 100%;
    background-color: transparent;
    outline: none;
    border: none;
    border: 1px solid #ff8888;
    padding: 7px;
    border-radius: 6px;
  }
  .title {
    font-size: 20px;
    margin-top: 30px;
    font-weight: 500;
  }
  form {
    width: 70%;
    @media (max-width: 400px) {
      width: 100%;
    }
  }
  .magic {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 9px;
    @media (max-width: 400px) {
      font-size: 17px;
    }
  }
  .links {
    display: flex;
  }
  .select {
    height: 30px;
    width: 80px;
    background-color: #ff8888;
    border-radius: 4px;
    padding: 3px 7px;
    color: #fff;
    cursor: pointer;
  }
  button {
    background-color: #ff8888;
    outline: none;
    border: none;
    padding: 10px;
    border-radius: 4px;
    margin-top: 30px;
    color: #fff;
    cursor: pointer;
  }
  @media (max-width: 400px) {
    padding: 20px;
  }
`;

const Destination = styled.div`
  margin-top: 20px;
  margin-bottom: 7px;
`;

const Create: React.FC = () => {
  const [destination, setDestination] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tag, setTag] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [messageType, setMessageType] = React.useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const data = { destination, title, customUrl, tag };
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://sl-lk.onrender.com/api/v1/create-short",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Short link created successfully");
        setMessageType("success");

        setTimeout(() => {
          navigate("/links");
        }, 3000);

        // navigate("/links");
      } else {
        setMessage("Failed to create short link");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      setMessage("Error creating link: " + error.message);
      setMessageType("error");
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <h4 className="title">Create Custom Link</h4>
      {message && <MessageDisplay message={message} type={messageType} />}

      <form onSubmit={handleSubmit}>
        <Destination>Destination</Destination>
        <input
          type="text"
          placeholder="https://yourlongurl.com"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <Destination>Title (optional)</Destination>
        <input
          type="text"
          placeholder="Custom title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p className="magic">Magic happens here 🤹‍♂️</p>
        <div className="links sm-gap ai-center">
          <div className="select flex justify-between ai-center">
            <div>sl.lk</div>
            <div>
              <FaAngleDown size={12} />
            </div>
          </div>
          <div>/</div>
          <div>
            <input
              type="text"
              placeholder="Custom url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
            />
          </div>
        </div>
        <Destination>Tag (optional)</Destination>
        <input
          type="text"
          placeholder="Coding, Game, Movies..."
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Short"}
        </button>
      </form>
    </Container>
  );
};

export default Create;
