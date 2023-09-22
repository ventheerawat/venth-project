import React from "react";
import ReactDOM from "react-dom/client";
// import App from './App.tsx'
import "./index.css";
import "./styles/customMui.css";
import { Auth0Provider } from "@auth0/auth0-react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Note from "./components/Note.tsx";
import Comment from "./components/Comment.tsx";
import { ThemeProvider } from "@mui/material/styles";
import Home from "./components/Home.tsx";
import theme from "./theme.tsx";
import Footer from "./components/Footer.tsx";
import Profile from "./components/Profile.tsx";
import PageNotFound from "./components/PageNotFound.tsx";

const domain = import.meta.env.VITE_APP_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_APP_AUTH0_CLIENT_ID;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [],
  },
  {
    path: "/note/:noteId",
    element: <Note />,
  },
  {
    path: "/note/:noteId/comment/:commentId",
    element: <Comment />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/404",
    element: <PageNotFound />,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <div id="page-container">
      <div id="content-wrap">
        <React.StrictMode>
          <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
              redirect_uri: window.location.origin,
            }}
          >
            <RouterProvider router={router} />
            {/* <App /> */}
          </Auth0Provider>
        </React.StrictMode>
      </div>
      <footer id="footer">
        <Footer></Footer>
      </footer>
    </div>
  </ThemeProvider>
);
