import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App"
import { SocketProvider } from "./components/SocketProvider";

const container = document.getElementById('root');
      const root = ReactDOM.createRoot(container);

      root.render(
        <SocketProvider><App/></SocketProvider>
      );