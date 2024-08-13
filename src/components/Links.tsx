import { FiCopy, FiEdit, FiTag } from "react-icons/fi";
import React, { useState } from "react";
import { extractDomain, formatDate } from "../utils";

import ConfirmationModal from "./Confirm";
import EditLink from "./Edit";
import { IoIosCalendar } from "react-icons/io";
import Loading from "./Loading";
import { MdDeleteOutline } from "react-icons/md";
import MessageDisplay from "./Message";
import Modal from "./Modal";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 40px;

  .bg {
    color: #d7645b; // Change color to match your design
  }

  .more {
    position: relative;
  }
  .dropdown-menu {
    position: absolute;
    background-color: #fde0e0a7;

    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    right: 0;
    top: 33px;
  }

  .dropdown-item {
    padding: 8px 16px;
    cursor: pointer;
    text-align: left;
    background: none;
    border: none;
    width: 100%;
    font-size: 12px;
  }

  .dropdown-item:hover {
    background-color: #fac9c9;
  }

  .btn-create {
    background: #ff6d63;
    border-radius: 5px;
    padding: 6px;
    margin-top: 1px;
    color: #fff;
  }

  .filter-container {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    .filter-items {
      background-color: #dcd2d2;
      background-color: #e4dcdc;

      padding: 7px 9px;
      cursor: pointer;
      border-radius: 3px;
      border: 1px solid #fef7f7;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  .filter {
    font-size: 15px;
  }

  .top {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  label {
    font-size: 15px;
    display: flex;
    align-items: center;

    input {
      margin-right: 7px;
      cursor: pointer;
    }
  }

  button {
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 15px;
    cursor: pointer;

    &.xsm-gap {
      border: 1px solid #a18e8e;
      padding: 5px 9px;
      border-radius: 5px;
      font-size: 13px;
    }
  }

  .list {
    margin-bottom: 20px;

    .list-item {
      /* height: 150px; */
      width: 100%;
      background-color: #fde0e0a7;
      border-radius: 8px;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .image {
    height: 55px;
    width: 55px;
    border-radius: 50%;
    background-color: #cdafaf;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .item-details {
    margin-bottom: 30px;
  }

  .date {
    font-size: 13px;
  }

  .link {
    margin-bottom: 3px;
    font-size: 14px;
  }

  .mt-2 {
    margin-top: 20px;
  }

  .faint {
    opacity: 0.5;
  }

  .hide {
    @media screen and (min-width: 768px) {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    padding: 10px;

    .desktop {
      display: none;
    }
  }
`;

const Link = styled.a`
  text-decoration: none; // Remove default underline
  color: #d7645b; // Change color to match your design

  &:hover {
    text-decoration: underline; // Add underline on hover
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

const Links: React.FC = () => {
  const [links, setLinks] = React.useState<Link[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [linkId, setLinkId] = useState<number | null>(null);
  const token = localStorage.getItem("token");

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [messageType, setMessageType] = React.useState<"success" | "error">(
    "success"
  );

  const navigate = useNavigate();

  const handleSelectLink = (id: number) => {
    setSelectedLinks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((linkId) => linkId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedLinks(links.map((link) => link._id));
    } else {
      setSelectedLinks([]);
    }
  };

  React.useEffect(() => {
    const getLinks = async () => {
      try {
        const response = await axios.get(
          "https://sl-lk.onrender.com/api/v1/links",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setLinks(response.data.data[0].links);
          console.log("All links retrieved successfully");
        } else {
          console.error("Failed to retrieve links");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getLinks();
  }, [token]);

  const handleCopyLink = (id: number, shortUrl: string) => {
    const fullUrl = `https://sl-lk.onrender.com/api/v1/${shortUrl}`;
    navigator.clipboard
      .writeText(fullUrl)
      .then(() => {
        setCopiedLinkId(id);
        setTimeout(() => {
          setCopiedLinkId(null);
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy the text to clipboard:", err);
      });
  };

  const handleDelete = (linkId: string) => {
    setLinkToDelete(linkId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (linkToDelete === null) return;
    setShowDeleteModal(false);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.delete(
        `https://sl-lk.onrender.com/api/v1/links/${linkToDelete}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setLinks(links.filter((link) => link._id.toString() !== linkToDelete));
        setMessage("Link deleted successfully");
        setMessageType("success");
      } else {
        console.error("Failed to delete the link");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error:", error);
      setMessageType("error");

      setMessage("Error deleting link: " + error?.message);
    } finally {
      setLoading(false);
      setLinkToDelete(null);
      setMessage("");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLinkToDelete(null);
  };

  const handleLinkUpdate = (updatedLink: Link) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link._id === updatedLink._id ? updatedLink : link
      )
    );
  };

  return (
    <Container>
      {loading && <Loading />}

      {isOpen && (
        <Modal>
          <EditLink
            linkId={linkId}
            close={() => setIsOpen(false)}
            onUpdate={handleLinkUpdate} // Pass the callback here
          />
        </Modal>
      )}

      {showDeleteModal && (
        <ConfirmationModal onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      <h2>Links</h2>
      <div className="filter-container">
        <button className="btn-create" onClick={() => navigate("/create")}>
          <p>Create Link</p>
        </button>
      </div>
      {message && <MessageDisplay message={message} type={messageType} />}

      <div className="flex md-gap top">
        <label>
          <input type="checkbox" onChange={handleSelectAll} />
          {selectedLinks.length} selected
        </label>
        <button className={selectedLinks.length > 0 ? "" : "faint"}>
          Hide
        </button>
        <button className={selectedLinks.length > 0 ? "" : "faint"}>Tag</button>
      </div>
      <div className="list">
        {links.map((link) => (
          <div
            key={link._id}
            className="list-item"
            style={{
              border: selectedLinks.includes(link._id)
                ? "1px solid #ff3939"
                : "1px solid transparent",
            }}
          >
            <div className="flex">
              <div className="desktop bg">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedLinks.includes(link._id)}
                      onChange={() => handleSelectLink(link._id)}
                    />
                  </label>
                </div>
              </div>
              <div className="flex md-gap">
                <div className="desktop">
                  <div className="image" />
                </div>

                <div>
                  <div className="item-details">
                    <div className="title">
                      <Link
                        className="title"
                        href={link.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.title || extractDomain(link.destination)}
                      </Link>
                    </div>

                    <p className="link">
                      <Link
                        href={`https://sl-lk.onrender.com/api/v1/${link.shortUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`https://sl.lk/${link.shortUrl}`}
                      </Link>
                    </p>

                    <p className="link">
                      <Link
                        href={link.destination}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.destination}
                      </Link>
                    </p>
                  </div>

                  <div className="bg flex md-gap">
                    <div className="flex ai-center xsm-gap">
                      <div className="center">
                        <IoIosCalendar />
                      </div>
                      <p className="date">{formatDate(link.createdAt)}</p>
                    </div>
                    <div className="flex ai-center xsm-gap">
                      <div className="center">
                        <FiTag />
                      </div>
                      <p className="date">{link.tag || "No tag"}</p>
                    </div>
                  </div>

                  <div className="flex xsm-gap mt-2 hide bg">
                    <button
                      className="flex ai-center xsm-gap"
                      onClick={() => handleCopyLink(link._id, link.shortUrl)}
                    >
                      <FiCopy color="#d7645b" />
                      {copiedLinkId === link._id ? "Copied!" : "Copy"}
                    </button>

                    <button
                      className="flex ai-center xsm-gap"
                      onClick={() => {
                        setIsOpen(true);
                        setLinkId(link._id);
                      }}
                    >
                      <FiEdit color="#d7645b" />
                    </button>
                    <button
                      className="flex ai-center xsm-gap more"
                      onClick={() => handleDelete(link._id.toString())}
                    >
                      <MdDeleteOutline size={17} color="#d7645b" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="desktop">
              <div className="flex xsm-gap">
                <button
                  className="flex ai-center xsm-gap"
                  onClick={() => handleCopyLink(link._id, link.shortUrl)}
                >
                  <FiCopy color="#d7645b" />
                  {copiedLinkId === link._id ? "Copied!" : "Copy"}
                </button>

                <button
                  className="flex ai-center xsm-gap"
                  onClick={() => {
                    setIsOpen(true);
                    setLinkId(link._id);
                  }}
                >
                  <FiEdit color="#d7645b" />
                </button>
                <button
                  className="flex ai-center xsm-gap more"
                  onClick={() => handleDelete(link._id.toString())}
                >
                  <MdDeleteOutline size={17} color="#d7645b" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default Links;
