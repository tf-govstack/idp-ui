import React from "react";
import Authorize from "../components/Authorize";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";

export default function AuthorizePage() {
  return (
    <>
      <Authorize
        authService={authService}
        localStorageService={localStorageService}
      />
    </>
  );
}
