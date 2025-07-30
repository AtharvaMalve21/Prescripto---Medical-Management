import { BrowserRouter } from "react-router-dom";
import { AdminContextProvider } from "./context/AdminContext.jsx";
import { DoctorContextProvider } from "./context/DoctorContext.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <DoctorContextProvider>
        <App />
      </DoctorContextProvider>
    </AdminContextProvider>
    <Toaster />
  </BrowserRouter>
);
