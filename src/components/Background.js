import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IDPQRCode from "./IDPQRCode";

export default function Background({
  heading,
  logoPath,
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
      <section class="text-gray-600 mt-7 body-font">
        <div class="container flex mx-auto px-5 md:flex-row flex-col items-center">
          <div class="flex justify-center rounded-none rounded-r-lg lg:max-w-lg md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              class="object-cover object-center rounded"
              alt="user signing in"
              src={backgroundImgPath}
            />
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <div class="w-full flex justify-center">
              <img class="mb-4 h-20" src={logoPath} />
            </div>
            <div class="w-full">
              <h1 class="flex justify-center title-font sm:text-3xl text-3xl mb-16 font-medium text-gray-900">
                {heading}
              </h1>
            </div>
            <div class="w-full flex justify-center">
              <div className="w-96 h-min shadow-lg rounded bg-[#F8F8F8]">
                <div class="w-full flex justify-center">
                  <ul
                    className="divide-dashed w-full flex mb-0 list-none flex-wrap pb-2 flex-row grid grid-cols-2"
                    role="tablist"
                  >
                    {tabs.map((tab, index) => (
                      <li
                        key={tab.name + index}
                        className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                      >
                        <a
                          className={
                            "text-xs font-bold uppercase px-5 py-3 border border-2 rounded block leading-normal " +
                            (openTab === index
                              ? "text-white bg-gradient-to-t from-cyan-500 to-blue-500"
                              : "text-slate-400 bg-white")
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenTab(index);
                          }}
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
                    <div class="flex justify-center py-5">
                      <button
                        class={
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
      </section>
    </>
  );
}
