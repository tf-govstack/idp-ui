import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

let initiate = true;

export default function IDPQRCode({ i18nKeyPrefix = "IDPQRCode" }) {
  const { t } = useTranslation("translation", { keyPrefix: i18nKeyPrefix });
  const [qr, setQr] = useState(window.location.href);

  const GenerateQRCode = (text) => {
    QRCode.toDataURL(
      text,
      {
        width: 600,
        margin: 2,
        color: {
          dark: "#000000",
        },
      },
      (err, text) => {
        if (err) return console.error(err);
        setQr(text);
      }
    );
  };

  useEffect(() => {
    GenerateQRCode(qr);
  });

  return (
    <>
      <div className="grid grid-cols-6 items-center">
        <div className="flex justify-center col-start-2 col-span-4">
          <h1 class="text-center text-sky-600 font-semibold">
            {t("sign_in_with_inji")}
          </h1>
        </div>
      </div>
      <p class="text-center text-black-600 font-semibold my-4">
        {t("scan_with_inji")}
      </p>
      <div className="app flex justify-center">
        {qr && (
          <>
            <div className="border border-4 border-sky-600 rounded-3xl p-2 w-44 h-44">
              <img src={qr} />
              <div className="flex justify-center">
                <p className=" w-22 bg-[#F8F8F8] text-center">
                  {t("inji_app")}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      <p class="text-center text-black-600 font-semibold mt-8 mb-4">
        {t("dont_have_inji")}&nbsp;
        <a href="#" class="text-sky-600">
          {t("download_now")}
        </a>
      </p>
    </>
  );
}
