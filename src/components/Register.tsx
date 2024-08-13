import { FaEnvelope, FaUser } from "react-icons/fa";

import Button from "./Button";
import Input from "./Input";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import MessageDisplay from "./Message";
import React from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import axios from "axios";
import register from "../assets/register.svg";
import styled from "styled-components";
import useMediaQuery from "../hook/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useUser } from "../store/useUser";

const Container = styled.div`
  height: 100vh;
  display: flex;
  background-color: #ffdcdc;

  .link {
    font-size: 13px;
    margin-top: 8px;
    display: flex;
    gap: 3px;
  }

  .register {
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
`;

const Inner = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const BoxOne = styled.div`
  height: 100%;
  img {
    height: 500px;
    width: 500px;
  }
`;

const BoxTwo = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 90px;
  height: 100%;
`;

const formDetails = [
  {
    id: 1,
    title: "Username",
    key: "username",
    type: "text",
    icon: <FaUser />,
    errors: [{ id: "1", title: "Username is required" }],
  },
  {
    id: 2,
    title: "Email",
    key: "email",
    type: "email",
    icon: <FaEnvelope />,
    errors: [{ id: "1", title: "Email is required" }],
  },
  {
    id: 3,
    title: "Password",
    key: "password",
    type: "password",
    icon: <RiLockPasswordLine size={19} />,
    errors: [{ id: "1", title: "Password is required" }],
  },
  {
    id: 4,
    title: "Confirm Password",
    key: "confirmPassword",
    type: "password",
    icon: <RiLockPasswordLine size={19} />,
    errors: [{ id: "1", title: "Confirm Password is required" }],
  },
];

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);

  const [message, setMessage] = React.useState<string | null>(null);
  const [messageType, setMessageType] = React.useState<"success" | "error">(
    "success"
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const [formValues, setFormValues] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isMobile = useMediaQuery("(max-width: 780px)");
  const { setUser } = useUser();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = formDetails.reduce((acc, field) => {
      if (!formValues[field.key as keyof typeof formValues]) {
        acc[field.key as keyof typeof errors] = field.errors[0].title;
      }
      return acc;
    }, {} as typeof errors);

    if (formValues.password !== formValues.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://sl-lk.onrender.com/api/v1/create/user",
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setMessageType("success");
      setMessage(response.data.message); // Success message from the backend
      setUser(response.data.user);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessageType("error");
      setMessage(error.response?.data?.error || "Registration failed"); // Error message from the backend
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {loading && <Loading />}
      <Inner className="flex-1">
        <BoxOne className="flex-1 flex ai-center jc-center">
          <img src={register} alt="log in" />
        </BoxOne>
      </Inner>
      <BoxTwo className={"flex-1"}>
        <div className={isMobile ? "mobile" : ""}>
          <h2 className="register">Register</h2>
          <p className="welcome">Create your account.</p>
          {message && <MessageDisplay message={message} type={messageType} />}

          <form onSubmit={handleRegister}>
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
                  showHideIcon={field.type === "password"}
                />
                {errors[field.key as keyof typeof errors] && (
                  <p
                    style={{
                      color: "red",
                      marginTop: "-9px",
                      fontSize: "12px",
                    }}
                  >
                    {errors[field.key as keyof typeof errors]}
                  </p>
                )}
              </div>
            ))}
            <Button>REGISTER</Button>
            <div className="flex jc-end link">
              <p>Have an account?</p>
              <Link to="/login">Log In</Link>
            </div>
          </form>
        </div>
      </BoxTwo>
    </Container>
  );
};

export default Register;
