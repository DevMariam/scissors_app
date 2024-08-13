import {
  Create,
  Dashboard,
  Links,
  LogIn,
  Main,
  Profile,
  Register,
} from "./components";
import { Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Main>
              <Dashboard />
            </Main>
          }
        />
        <Route path="/login" element={<LogIn />} />
        <Route
          path="/create"
          element={
            <Main>
              <Create />
            </Main>
          }
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/links"
          element={
            <Main>
              <Links />
            </Main>
          }
        />
        <Route
          path="/profile"
          element={
            <Main>
              <Profile />
            </Main>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
