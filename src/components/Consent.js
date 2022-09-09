import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';
import { otpFields } from "../constants/formFields";
import { post_AuthCode, post_AuthenticateUser } from '../services/AuthService';
import FormAction from "./FormAction";


const fields = otpFields;
let fieldsState = {};
fields.forEach(field => fieldsState["Otp" + field.id] = '');


export default function Consent() {
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("LOADED");
    const [searchParams, setSearchParams] = useSearchParams();
    const [claims, setClaims] = useState([]);
    const [scope, setScope] = useState([]);

    const handleScopeChange = (e) => {
        let id = e.target.id

        let resultArray = []
        if (e.target.checked)//if checked (true), then add this id into checkedList
        {
            resultArray = scope.filter(CheckedId => CheckedId !== id)
            resultArray.push(id)
        }
        else//if not checked (false), then remove this id from checkedList
        {
            resultArray = scope.filter(CheckedId => CheckedId !== id)
        }

        setScope(resultArray)
    };

    const handleClaimChange = (e) => {

        let id = e.target.id

        let resultArray = []
        if (e.target.checked)//if checked (true), then add this id into checkedList
        {
            resultArray = claims.filter(CheckedId => CheckedId !== id)
            resultArray.push(id)
        }
        else//if not checked (false), then remove this id from checkedList
        {
            resultArray = claims.filter(CheckedId => CheckedId !== id)
        }

        setClaims(resultArray)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit");
        submitConsent();
    }

    const handleCancel = (e) => {
        e.preventDefault();
        console.log("cancel");
    }

    let oAuthDetails = JSON.parse(window.localStorage.getItem("oauth_details"));

    var authorizeScopes = oAuthDetails?.authorizeScopes;
    var essentialClaims = oAuthDetails?.essentialClaims;
    var voluntaryClaims = oAuthDetails?.voluntaryClaims;

    //Handle Login API Integration here
    const submitConsent = async () => {

        try {
            let transactionId = searchParams.get("transactionId");
            let nonce = searchParams.get("nonce");
            let state = "12fsaf1";
            let acceptedClaims = claims;
            let permittedAuthorizeScopes = scope;

            setStatus("LOADING");

            const authCodeResponse = await post_AuthCode(nonce, state, transactionId, acceptedClaims, permittedAuthorizeScopes);

            setStatus("LOADED");

            const { response, errors } = authCodeResponse

            let params = "?nonce=" + nonce + "&state=" + state + "&";

            //TODO redirect with server response
            if (errors != null && errors.length > 0) {
                console.log(errors[0].errorCode);
                let redirect_uri = window.localStorage.getItem("redirect_uri");
                window.location.replace(redirect_uri + params + "error=" + errors[0].errorCode);
                //setError("Redirections failed: " + errors[0].errorCode);

                return;
            } else {
                setError(null)
                window.location.replace(response.redirectUri + params + "code=" + response.code);
            }
        }
        catch (errormsg) {
            // setError(errormsg)
            // setStatus("ERROR")
        }
    }

    return (
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded" style={{ background: '#F2F4F4' }}>
            <div className="px-4 py-4 flex-auto" >
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="-space-y-px">
                        Client is requesting access to
                    </div>

                    {
                        authorizeScopes?.length > 0 &&
                        <>
                            <h2>Authorize Scopes</h2>
                            {
                                authorizeScopes?.map(
                                    (item) => (
                                        <div className="flex items-center justify-between" key={item}>
                                            <label labelfor={item} className="inline-flex relative items-center mb-5 cursor-pointer">
                                                <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleScopeChange} />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                            </label>
                                        </div>
                                    )
                                )
                            }
                        </>
                    }

                    {
                        essentialClaims?.length > 0 &&
                        <>
                            <h2>Essential Claims</h2>
                            {
                                essentialClaims?.map(
                                    (item) => (
                                        <div className="flex items-center justify-between" key={item}>
                                            <label labelfor={item} className="inline-flex relative items-center mb-5 cursor-pointer">
                                                <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleClaimChange} />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                            </label>
                                        </div>
                                    )
                                )
                            }
                        </>
                    }

                    {
                        voluntaryClaims?.length > 0 &&
                        <>
                            <h2>Voluntary Claims</h2>
                            {
                                voluntaryClaims?.map(
                                    (item) => (
                                        <div className="flex items-center justify-between" key={item}>
                                            <label labelfor={item} className="inline-flex relative items-center mb-5 cursor-pointer">
                                                <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleClaimChange} />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                            </label>
                                        </div>
                                    )
                                )
                            }
                        </>
                    }

                    {
                        <div>
                            {
                                (status === "LOADING") && <LoadingIndicator size="medium" message="Redirecting. Please wait...." />
                            }
                        </div>
                    }
                    {
                        (status !== "LOADING") && error && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                                {error}
                            </div>
                        )
                    }


                    <div>
                        <button className="flex justify-center w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
                            onClick={handleSubmit}
                        >
                            Allow
                        </button>
                    </div>

                    <div>
                        <button className="flex justify-center w-full bg-transparent hover:bg-blue-700 text-blue-700 font-bold hover:text-white py-2 px-4 border border-blue-700 hover:border-transparent rounded"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}