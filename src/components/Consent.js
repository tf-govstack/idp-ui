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
        submitConsent();
    }

    const handleCancel = (e) => {
        e.preventDefault();
    }

    let oAuthDetails = JSON.parse(window.localStorage.getItem("oauth_details"));

    var authorizeScopes = oAuthDetails?.authorizeScopes;
    var essentialClaims = oAuthDetails?.essentialClaims;
    var voluntaryClaims = oAuthDetails?.voluntaryClaims;
    var clientName = oAuthDetails?.clientName;
    var logoUrl = oAuthDetails?.logoUrl;

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
                    <div className="flex justify-center">
                        <img src={logoUrl}></img>
                    </div>

                    <div className="flex justify-center">
                        <b>{clientName} is requesting access to : </b>
                    </div>

                    {
                        authorizeScopes?.length > 0 &&
                        <>
                            <h2>Authorize Scopes</h2>
                            <div className='divide-y'>
                                {
                                    authorizeScopes?.map(
                                        (item) => (
                                            <div key={item}>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div className="flex justify-start">
                                                        <label labelfor={item} className="inline-flex relative items-center mb-1 mt-1 cursor-pointer">
                                                            <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleClaimChange} />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                    <div className="flex justify-end relative items-center mb-1 mt-1 cursor-pointer">
                                                        <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </>
                    }
                    {
                        essentialClaims?.length > 0 &&
                        <>
                            <h2>Essential Claims</h2>
                            <div className='divide-y'>
                                {
                                    essentialClaims?.map(
                                        (item) => (
                                            <div key={item}>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div className="flex justify-start">
                                                        <label labelfor={item} className="inline-flex relative items-center mb-1 mt-1 cursor-pointer">
                                                            <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleClaimChange} />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                    <div className="flex justify-end relative items-center mb-1 mt-1 cursor-pointer">
                                                        <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
                        </>
                    }

                    {
                        voluntaryClaims?.length > 0 &&
                        <>
                            <h2>Voluntary Claims</h2>
                            <div className='divide-y'>
                                {
                                    voluntaryClaims?.map(
                                        (item) => (
                                            <div key={item}>
                                                <div class="grid grid-cols-2 gap-4">
                                                    <div className="flex justify-start">
                                                        <label labelfor={item} className="inline-flex relative items-center mb-1 mt-1 cursor-pointer">
                                                            <input type="checkbox" value="" id={item} className="sr-only peer" onChange={handleClaimChange} />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                    <div className="flex justify-end relative items-center mb-1 mt-1 cursor-pointer">
                                                        <span className="ml-3 text-sm font-medium text-black-900 dark:text-black-300">{item}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>
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

                    <div class="grid grid-cols-2 gap-4">

                        <button type="button" class="flex justify-center w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 light:bg-gray-800 light:text-white light:border-gray-600 light:hover:bg-gray-700 light:hover:border-gray-600 light:focus:ring-gray-700" onClick={handleCancel}>Cancel</button>

                        <div className="flex justify-end">
                            <button type="button" class="flex justify-center w-full text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={handleSubmit}>Allow
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div >
    )
}