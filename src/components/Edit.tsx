import React, { useEffect, useState } from "react";

import Alert from "./Alert";
import { MdClose } from "react-icons/md";
import Modal from "./Modal";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */

  .title {
    margin-bottom: 9px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const Button = styled.button`
  background: #ff6d63;
  color: #fff;
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #ff4c3a !important;

  &:hover {
  }
`;

interface Link {
  _id: number;
  title: string;
  destination: string;
  shortUrl: string;
  createdAt: string;
  tag: string;
}

const EditLink: React.FC<{
  linkId: number | null;
  close: () => void;
  onUpdate: (updatedLink: Link) => void;
}> = ({ linkId, close, onUpdate }) => {
  const [link, setLink] = useState<Link | null>(null);
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [tag, setTag] = useState("");
  const navigate = useNavigate();

  const [alert, setAlert] = useState<{
    message: string;
    type: string;
    show: boolean;
  }>({
    message: "",
    type: "success" || "error",
    show: false,
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await axios.get(
          `https://sl-lk.onrender.com/api/v1/links/${linkId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const linkData = response.data.link;
          setLink(linkData);
          setTitle(linkData.title);
          setDestination(linkData.destination);
          setTag(linkData.tag);
          navigate("/links");
        } else {
          console.error("Failed to fetch link data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchLink();
  }, [linkId, navigate, token]);

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://sl-lk.onrender.com/api/v1/links/${linkId}`,
        {
          title,
          destination,
          tag,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        onUpdate(response.data.link); // Call the callback function with the updated link
        close(); // Close the modal after updating

        setAlert({
          type: "success",
          show: true,
          message: "Link updated successfully",
        });
        navigate("/links");
      } else {
        console.error("Failed to update link");
        setAlert({
          type: "error",
          show: true,
          message: "Failed to update link",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: string | any) {
      console.error("Error:", error);
      setAlert({
        type: "error",
        show: true,
        message: error,
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({
      ...alert,
      show: false,
    });
    close();
    navigate("/links");
  };

  if (!link) {
    return <div>Loading...</div>;
  }

  return (
    <Modal>
      <Container>
        <div className="flex ai-center justify-between title">
          <h2>Edit Link</h2>
          <button onClick={close}>
            <MdClose size={20} />
          </button>
        </div>
        {alert.show && (
          <Alert
            message={alert.message}
            type={alert.type}
            show={alert.show}
            onClose={handleCloseAlert}
          />
        )}
        <form onSubmit={handleUpdateLink}>
          <FormGroup>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="destination">Destination URL</label>
            <input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="tag">Tag</label>
            <input
              id="tag"
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Update Link</Button>
        </form>
      </Container>
    </Modal>
  );
};

export default EditLink;
