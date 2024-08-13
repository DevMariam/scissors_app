import { ChangeEvent, FormEvent, useState } from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";

import axios from "axios";
import styled from "styled-components";
import { useUser } from "../store/useUser";

// Define types for user data
interface User {
  username: string;
  email: string;
}

const Container = styled.div`
  padding: 30px;
  h2 {
    margin: 30px 0;
  }
  @media (max-width: 400px) {
    padding: 10px;
  }
`;

const ProfileCard = styled.div`
  background-color: #fbe4e4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const ProfileField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ProfileIcon = styled.div`
  font-size: 20px;
  color: #ff6d63;
  margin-right: 10px;
`;

const ProfileText = styled.div`
  font-size: 15px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #ff6d63;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e55a51;
  }
`;

const PasswordChangeForm = styled.form`
  background-color: #fbe4e4;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    background-color: transparent;
    outline: none;
  }

  .error {
    color: red;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .success {
    color: green;
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

const ProfileSmall = styled.div`
  font-size: 13px;
  font-weight: bold;
`;

const ProfilePage: React.FC = () => {
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const { user: storeUser } = useUser();

  // Fallback to local storage if user is not available from store
  const user: User | null =
    storeUser || JSON.parse(localStorage.getItem("user") || "null");

  const token = localStorage.getItem("token");

  const handleChangePassword = () => {
    setIsChangingPassword(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        "https://sl-lk.onrender.com/api/v1/password",
        {
          oldPassword, // Current password input from the user
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Ensure you have user token
          },
        }
      );
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.log(err);
      setError(
        "Failed to change password. Please ensure your current password is correct."
      );
    }
  };

  const handleOldPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  return (
    <Container>
      <h2>Profile</h2>
      <ProfileCard>
        <ProfileField className="flex">
          <ProfileIcon>
            <FaUser size={15} />
          </ProfileIcon>
          <div>
            <ProfileSmall>Name</ProfileSmall>
            <ProfileText>{user?.username}</ProfileText>
          </div>
        </ProfileField>
        <ProfileField className="flex">
          <ProfileIcon>
            <FaEnvelope size={15} />
          </ProfileIcon>
          <div>
            <ProfileSmall>Email</ProfileSmall>
            <ProfileText>{user?.email}</ProfileText>
          </div>
        </ProfileField>
      </ProfileCard>

      <Button onClick={handleChangePassword}>
        <FaLock /> Change Password
      </Button>

      {isChangingPassword && (
        <PasswordChangeForm onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Current Password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
          {error && <div className="error">{error}</div>}
          {successMessage && <div className="success">{successMessage}</div>}
          <Button type="submit">Update Password</Button>
        </PasswordChangeForm>
      )}
    </Container>
  );
};

export default ProfilePage;
