import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/UserContext.jsx";
import { DoctorContextProvider } from "./context/DoctorContext.jsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <DoctorContextProvider>
        <App />
      </DoctorContextProvider>
    </UserContextProvider>
    <Toaster />
  </BrowserRouter>
);
