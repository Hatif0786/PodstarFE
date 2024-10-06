import React from "react";
import ReactDOM from "react-dom";
import './styles/custom-theme.less';
import App from "./App";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FavoriteAlbumProvider } from "./utils/Contexts/FavoriteAlbumContext";
import { SnackbarProvider } from "notistack";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="672842350788-73nifi8h0u67psq671motg093m52v650.apps.googleusercontent.com">
      <FavoriteAlbumProvider>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
        </FavoriteAlbumProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  rootElement
);

