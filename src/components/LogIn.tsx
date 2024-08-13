import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

import Button from "./Button";
import { FaUser } from "react-icons/fa";
// import Goback from "./Goback";
import Input from "./Input";
import Loading from "./Loading";
import MessageDisplay from "./Message";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import logIn from "../assets/login.svg";
import styled from "styled-components";
import useMediaQuery from "../hook/useMediaQuery";
import { useUser } from "../store/useUser";

const Container = styled.div`
  height: 100vh;
  display: flex;
  background-color: #ffdcdc;

  .login {
    margin-top: 15px;
  }

  .welcome {
    margin-top: 2px;
    font-size: 13px;
    margin-bottom: 20px;
  }

  .label {
    margin-top: 10px;
    font-size: 14px;
  }

  form {
    width: 400px;
    @media (max-width: 400px) {
      width: 100%;
    }
  }

  .link {
    font-size: 13px;
    margin-top: 8px;
    display: flex;
    gap: 3px;
  }

  .forgot {
    margin-bottom: 10px;
  }

  .mobile {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin: 0 auto;
  }

  .error {
    color: red;
    font-size: 12px;
    margin-top: -6px;
  }
`;

const BoxOne = styled.div`
  height: 100%;
  img {
    height: 500px;
    width: 500px;
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const BoxTwo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 150px;
  height: 100%;
`;

const formDetails = [
  {
    id: 1,
    title: "Username or email",
    key: "usernameOrEmail",
    type: "text",
    icon: <FaUser />,
    errors: [{ id: "1", title: "Username or email is required" }],
  },
  {
    id: 2,
    title: "Password",
    key: "password",
    type: "password",
    icon: <RiLockPasswordLine size={19} />,
    errors: [{ id: "1", title: "Password is required" }],
  },
];

const LogIn = () => {
  const isMobile = useMediaQuery("(max-width: 780px)");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<"success" | "error">(
    "success"
  );

  const { setUser } = useUser();

  const [formValues, setFormValues] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    // Clear the error for the field being updated
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs (simple example)
    const newErrors: typeof errors = {
      usernameOrEmail: "",
      password: "",
    };

    formDetails.forEach((field) => {
      if (!formValues[field.key as keyof typeof formValues]) {
        newErrors[field.key as keyof typeof errors] = field.errors[0].title;
      }
    });

    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Make API request to the backend
      const response = await axios.post(
        "https://sl-lk.onrender.com/api/v1/login",
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);

      setMessageType("success");
      setMessage(response.data.message); // Success message from the backend
      setUser(response.data.user);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error logging in:", error);
      setMessageType("error");
      setMessage(error.response?.data?.error || "Login failed"); // Error message from the backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Loading />}

      {!isMobile && (
        <BoxOne className="flex-1 flex ai-center jc-center">
          <img src={logIn} alt="log in" />
        </BoxOne>
      )}
      <BoxTwo className={"flex-1"}>
        <div className={isMobile ? "mobile" : ""}>
          {/* <Goback onClick={() => navigate("/")} /> */}
          <h2 className="login">Log In</h2>
          <p className="welcome">Welcome back.</p>
          {message && <MessageDisplay message={message} type={messageType} />}

          <form onSubmit={handleLogin}>
            {formDetails.map((field) => (
              <div key={field.id}>
                <p className="label">{field.title}</p>
                <Input
                  icon={field.icon}
                  title={field.title}
                  value={formValues[field.key as keyof typeof formValues]}
                  onChange={handleChange}
                  name={field.key}
                  type={field.type}
                />
                {errors[field.key as keyof typeof errors] && (
                  <p className="error">
                    {errors[field.key as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
            {/* <div className="flex jc-end forgot">
              <Link to="/forgot">Forgot Password</Link>
            </div> */}
            <Button>LOG IN</Button>
            <div className="flex jc-end link">
              <p>Don't have an account?</p>
              <Link to="/register">Create Account</Link>
            </div>
          </form>
        </div>
      </BoxTwo>
    </Container>
  );
};

export default LogIn;
