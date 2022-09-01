import React from "react";
import Header from "../components/Header"
import Login from "../components/Login"
import Tabs from '../components/Tabs';
import { tabList } from "../constants/formFields";
//import { QRCode } from "../components/QRCode";

const tabs = tabList;
const comp = {
    otp: Login,
    QRCode: Login,
    Header: Header("Login to test",
    "Have not registered for MOSIP yet? ",
    "Preregister",
    "https://mec.mosip.io/preregister")
  };

 function block(inst) {
    if (typeof comp[inst] !== "undefined") {
      return React.createElement(comp[inst], {
        inst: inst
      });
    }
    return React.createElement(
      () => <div>The component {inst} has not been created yet.</div>
    );
  };

let tabCompInstance = new Map();

tabs.map(tab=> {tabCompInstance.set(tab.comp, block(tab.comp))});
  
export default function LoginPage(){
    return(
        <>
             <Header
                heading="Login to your account"
                paragraph="Have not registered for MOSIP yet? "
                linkName="Preregister"
                linkUrl="https://mec.mosip.io/preregister"
                />
             <Tabs color="purple" tabs={tabs} block= {tabCompInstance} />
            <Login/>
        </>
    )
}