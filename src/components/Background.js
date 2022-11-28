import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IDPQRCode from "./IDPQRCode";

export default function Background({
  heading,
  mosipLogoPath,
  clientLogoPath,
  clientName,
  backgroundImgPath,
  component,
  handleMoreWaysToSignIn,
  showMoreOption,
  i18nKeyPrefix = "header",
}) {
  const tabs = [
    {
      name: "inji_tab_name",
    },
    {
      name: "here_tab_name",
    },
  ];

  const [openTab, setOpenTab] = useState(0);
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  return (
    <>
      <section className="text-gray-600 mt-7 body-font">
        <div className="container flex mx-auto px-5 md:flex-row flex-col">
          <div className="flex justify-center lg:mt-32 mt-20 mb:mt-0 lg:w-1/2 md:w-1/2 w-5/6 mb-10 md:mb-0">
            <div>
              <img
                className="object-contain rounded"
                alt="user signing in"
                src={backgroundImgPath}
              />
            </div>
          </div>
          <div className="flex justify-start">
            <div className="lg:flex-grow lg:pl-24 md:pl-16 flex flex-col">
              <div className="w-full flex mb-4 justify-center items-center">
                <img className="h-20 mr-5" src={clientLogoPath} alt={clientName} />
                <span className="text-6xl flex mr-5">&#8651;</span>
                <img className="h-20" src={mosipLogoPath} alt="MOSIP" />
              </div>
              <div className="w-full">
                <h1 className="flex justify-center title-font sm:text-3xl text-3xl mb-8 font-medium text-gray-900">
                  {heading}
                </h1>
              </div>
              <div className="w-full flex justify-center">
                <div className="w-96 h-min shadow-lg rounded bg-[#F8F8F8]">
                  <div className="w-full flex justify-center">
                    <ul
                      className="divide-dashed w-full mr-2 ml-2 mt-3 flex mb-0 list-none flex-wrap pb-2 flex-row grid grid-cols-2"
                      role="tablist"
                    >
                      {tabs.map((tab, index) => (
                        <li
                          key={tab.name + index}
                          className="-mb-px flex-auto text-center"
                        >
                          <a
                            className={
                              "text-xs font-bold uppercase px-5 py-3 rounded block leading-normal " +
                              (openTab === index
                                ? "shadow-lg text-white border border-transparent bg-gradient-to-t from-cyan-500 to-blue-500"
                                : "shadow-inner border border-2 text-slate-400 bg-white")
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenTab(index);
                            }}
                            data-toggle="tab"
                            href="#link1"
                            role="tablist"
                          >
                            {t(tab.name)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-5 py-2">
                    <div className={openTab === 0 ? "block" : "hidden"}>
                      <IDPQRCode />
                    </div>
                    <div className={openTab === 1 ? "block" : "hidden"}>
                      {component}
                      <div className="flex justify-center py-5">
                        <button
                          className={
                            "text-gray-500 font-semibold" +
                            (showMoreOption ? " block" : " hidden")
                          }
                          onClick={handleMoreWaysToSignIn}
                        >
                          {t("more_ways_to_sign_in")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
