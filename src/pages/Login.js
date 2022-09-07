import React from "react";
import Header from "../components/Header"
import Otp from "../components/Otp"
import Tabs from '../components/Tabs';
import { tabList, otpFields, bioLoginFields } from "../constants/formFields";
import  IDPQRCode  from "../components/IDPQRCode";
import SBIL1Biometrics from "../components/SBIL1Biometrics";

const tabs = tabList;
const bioFields = bioLoginFields;

const comp = {
    OTP: Otp,
    QRCode: IDPQRCode,
    Biometric: SBIL1Biometrics
  };

  function InitiateSBIL1Biometrics(inst) {
    return React.createElement(comp[inst], {"param":bioFields});
  }

  function InitiateOtp(inst) {
    return React.createElement(comp[inst], {"param":otpFields});
  }

  function InitiateQRCode(inst) {
    return React.createElement(comp[inst]);
  }

 function createDynamicLoginElements(inst) {
    if (typeof comp[inst] === "undefined") {
      return React.createElement(
        () => <div>The component {inst} has not been created yet.</div>
      );
    }
  
    if(comp[inst] === SBIL1Biometrics) {
      return InitiateSBIL1Biometrics(inst);
    }

    if(comp[inst] === IDPQRCode) {
      return InitiateQRCode(inst);
    }

    if(comp[inst] === Otp) {
      return InitiateOtp(inst, otpFields)
    }
    return React.createElement(comp[inst]);
    
  };

let tabCompInstance = new Map();

tabs.map(tab=> {return tabCompInstance.set(tab.icon, createDynamicLoginElements(tab.comp))});
  
export default function LoginPage(){
    return(
        <>
             <Header
                heading="Login to your account"
                paragraph="Have not registered for MOSIP yet? "
                linkName="Preregister"
                linkUrl="https://mec.mosip.io/preregister"
                />
             <Tabs color="purple" tabs={tabs} block={tabCompInstance} />
        </>
    )
}