import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "./context/ThemeContext";
import { ClerkProvider } from "@clerk/clerk-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  RedirectToSignIn
} from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <SignedIn>
          <AppRouter />
        </SignedIn>

        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);
