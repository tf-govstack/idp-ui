import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { LoadingStates as states } from "../constants/states";

export default function IdpDetails() {
  const { t } = useTranslation("idpDetails");

  const [status, setStatus] = useState({ state: states.LOADED, msg: "" });
  const [details, setDetails] = useState(null);

  useEffect(() => {
    setStatus({ state: states.LOADING, msg: t("loading_msg") });

    let detailList = [
      { icon: null, name: "internal_api", value: "https://api.dev.mosip.net" },
      {
        name: "wellknown_api",
        value: window.origin + "/v1/idp/oidc/.well-known/openid-configuration",
      },
    ];

    setDetails(detailList);
    setStatus({ state: states.LOADED, msg: "" });
  }, []);

  return (
    <>
      <section class="text-gray-600 mt-7 body-font">
        <div class="container flex mx-auto px-5 md:flex-row flex-col items-center">
          <div class="flex justify-center rounded-none rounded-r-lg lg:max-w-lg md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              class="object-cover object-center rounded"
              alt="user signing in"
              src="images/illustration_one.png"
            />
          </div>
          <div class="lg:flex-grow md:w-1/2  flex flex-col md:items-start md:text-left items-center text-center">
            <div class="w-full flex justify-center">
              <img class="mb-4 h-20" src="logo.png" />
            </div>
            <div class="w-full">
              <h1 class="flex justify-center title-font sm:text-3xl text-3xl mb-16 font-medium text-gray-900">
                {t("idp_details_heading")}
              </h1>
            </div>
            <div class="w-full flex justify-center">
              {status.state === states.LOADED && details && (
                <div className={"w-3/4 h-min shadow-lg rounded bg-[#F8F8F8]"}>
                  <div className="py-3">
                    <div class="divide-y-2 gap-2">
                      {details.map((detail, idx) => (
                        <div class="px-2 py-1 grid grid-cols-3">
                          <div className="col-span-1 flex justify-center">
                            {detail.icon && <img src={detail.icon} />}
                            {!detail.icon && t(detail.name)}
                          </div>
                          <div className="col-span-2 flex justify-start">
                            {detail.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
