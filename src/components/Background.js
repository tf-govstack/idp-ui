import React from "react";
import { useTranslation } from "react-i18next";

export default function Background({
  heading,
  logoPath,
  backgroundImgPath,
  component,
  handleMoreWaysToSignIn,
  showMoreOption,
}) {
  const { t } = useTranslation("header");
  let moreOptionClass = showMoreOption ? "flex justify-center pb-5" : "hidden";
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
                <div className="px-5 py-3">{component}</div>
                <div class={moreOptionClass}>
                  <button
                    class="text-center text-gray-500 font-semibold"
                    onClick={handleMoreWaysToSignIn}
                  >
                    {t("more_ways_to_sign_in")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
