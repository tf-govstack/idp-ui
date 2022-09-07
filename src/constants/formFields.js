const otpFields=[
    {
        labelText:"Vid",
        labelFor:"Mosip vid",
        id:"mosip-vid",
        name:"vid",
        type:"text",
        autoComplete:"vid",
        isRequired:true,
        placeholder:"VID"   
    },
    {
        labelText:"Otp",
        labelFor:"otp",
        id:"otp",
        name:"otp",
        type:"password",
        autoComplete:"",
        isRequired:true,
        placeholder:"1234"   
    }
]

const bioLoginFields=[
    {
        labelText:"Vid",
        labelFor:"Mosip vid",
        id:"mosip-vid",
        name:"vid",
        type:"text",
        autoComplete:"vid",
        isRequired:true,
        placeholder:"VID"   
    }
]

const signupFields=[
    {
        labelText:"Username",
        labelFor:"username",
        id:"username",
        name:"username",
        type:"text",
        autoComplete:"username",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Vid",
        labelFor:"mosip-vid",
        id:"mosip-vid",
        name:"vid",
        type:"text",
        autoComplete:"vid",
        isRequired:true,
        placeholder:"Mosip vid"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirm-password",
        id:"confirm-password",
        name:"confirm-password",
        type:"password",
        autoComplete:"confirm-password",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

const tabList=[
    {
        name:"Log in with OTP",
        icon:"space-shuttle",  
        comp: "OTP"
    },
    {
        name:"Log in with Inji",
        icon:"cog",
        comp: "QRCode"  
    },
    {
        name:"Log in with Biometrics",
        icon:"briefcase",  
        comp: "Biometric"
    }
]

export {otpFields,signupFields, tabList, bioLoginFields}