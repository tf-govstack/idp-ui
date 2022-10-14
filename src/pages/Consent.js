import React from "react";
import Consent from "../components/Consent";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";

export default function ConsentPage() {
  return (
    <>
      <Consent
        authService={authService}
        localStorageService={localStorageService}
      />
    </>
  );
}
