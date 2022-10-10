import React from "react";
import Header from "../components/Header";
import SignInOptions from "../components/SignInOptions";

export default function SignInOptionsPage() {
  return (
    <>
      <Header
        heading="Login to your account"
        paragraph="Have not registered for MOSIP yet? "
        linkName="Preregister"
        linkUrl="https://mec.mosip.io/preregister"
      />
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-50">
        <div className="px-4 py-5 flex-auto">
          <SignInOptions />
        </div>
      </div>
    </>
  );
}
