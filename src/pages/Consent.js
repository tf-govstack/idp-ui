import React from "react";
import Consent from "../components/Consent";
import { authService } from "../services/authService";
import { localStorageService } from "../services/local-storageService";

export default function ConsentPage() {
  return (
    <>
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Consent
            authService={authService}
            localStorageService={localStorageService}
          />
        </div>
      </div>
    </>
  );
}
