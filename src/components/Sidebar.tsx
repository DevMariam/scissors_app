import {
  FaAngleLeft,
  FaAngleRight,
  FaHome,
  FaLink,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

import ConfirmationModal from "./Confirm";
import styled from "styled-components";
import { useState } from "react";
import { useUser } from "../store/useUser";

// Styled components for the sidebar
const Container = styled.div<{ isOpen: boolean }>`
  width: ${(props) => (props.isOpen ? "240px" : "70px")};
  background-color: #fbe4e4;
  transition: width 0.5s ease;
  position: relative;
  border-right: 1px solid #fef7f7;
  height: 100vh;

  .logo {
    height: ${(props) => (props.isOpen ? "55px" : "30px")};
    width: ${(props) => (props.isOpen ? "55px" : "30px")};
    background-color: #00ccff;
    margin-top: 40px;
    margin-bottom: 30px;
    border-radius: 50%;
    border: 1px solid #fef7f7;
    color: white;
    font-size: ${(props) => (props.isOpen ? "15px" : "12px")};
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 400px) {
      height: 30px;
      width: 30px;
      font-size: 12px;
    }
  }

  @media (max-width: 400px) {
    width: 70px;
    position: fixed;
  }
`;

const Arrow = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: #fbd9d9;
  border: 1px solid #fef7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 98;
  position: absolute;
  right: 0;
  top: 30px;
  transform: translate(50%, 0%);
  cursor: pointer;

  @media (max-width: 400px) {
    display: none;
  }
`;

const SidebarLink = styled.div<{ isActive: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding-left: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 10px 10px;
  border-radius: 9px;
  cursor: pointer;
  padding: ${(props) => (props.isOpen ? "13px 5px" : "10px")};
  border: 1px solid transparent;

  &:hover {
    background-color: #f9b7b740;
    border: 1px solid #94848420;
  }

  &.active {
    background-color: #f9b7b740;
    border: 1px solid #94848420;
  }

  .border {
    height: ${(props) => (props.isOpen ? "20px" : "0px")};
    width: 3px;
    background: #ff6d63;
    border-radius: 9px;
  }

  .icon {
    margin-left: ${(props) => (props.isOpen ? "9px" : "0px")};
    margin-right: 3px;
  }
`;

const Title = styled.span`
  margin-left: 10px;

  @media (max-width: 400px) {
    display: none;
  }
`;

interface User {
  username: string;
  email: string;
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarLinks = [
    {
      id: 1,
      title: "Home",
      link: "/dashboard",
      icon: <FaHome size={18} color="#ff6d63" />,
    },
    {
      id: 2,
      title: "Links",
      link: "/links",
      icon: <FaLink size={15} color="#ff6d63" />,
    },
    {
      id: 4,
      title: "Profile",
      link: "/profile",
      icon: <FaUser size={15} color="#ff6d63" />,
    },
    {
      id: 5,
      title: "Logout",
      type: "button",
      icon: <FaSignOutAlt size={15} color="#ff6d63" />,
      onClick: () => {
        setShowDeleteModal(true);

        // Perform any logout logic here
        // localStorage.removeItem("token");
        // navigate("/login"); // Navigate to the login page
      },
    },
  ];

  const isActiveLink = (link: string) => location.pathname.includes(link);

  const { user: storeUser } = useUser();

  // Fallback to local storage if user is not available from store
  const user: User | null =
    storeUser || JSON.parse(localStorage.getItem("user") || "null");

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Container isOpen={isOpen}>
      {showDeleteModal && (
        <ConfirmationModal
          onConfirm={logOut}
          onCancel={cancelDelete}
          text="Confirm you want to log out"
        />
      )}
      <Arrow
        onClick={toggleSidebar}
        aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? <FaAngleLeft size={17} /> : <FaAngleRight size={17} />}
      </Arrow>
      <div className="center">
        <p className="logo center">{user?.username.charAt(0).toUpperCase()}</p>
      </div>
      {sidebarLinks.map((link) => (
        <SidebarLink
          key={link.id}
          isOpen={isOpen}
          className={isActiveLink(link.link!) ? "active" : ""}
          isActive={isActiveLink(link.link!)}
          onClick={
            link.type === "button" ? link.onClick : () => navigate(link.link!)
          }
        >
          {isActiveLink(link.link!) && <div className="border" />}
          <div className="icon">{link.icon}</div>
          {isOpen && <Title>{link.title}</Title>}
        </SidebarLink>
      ))}
    </Container>
  );
};

export default Sidebar;
