import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

export default function NavHeader() {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);

  const changeLanguageHandler = (e) => {
    i18n.changeLanguage(e.value);
    setSelectedLang(e);
  };

  const data = [
    {
      value: "en",
      label: "English (US)",
    },
    {
      value: "hn",
      label: "Hindi",
    },
    {
      value: "ar",
      label: "Arabic",
    },
  ];

  useEffect(() => {
    setSelectedLang(data[0]);
  }, []);

  return (
    <nav class="bg-gray-100 border-gray-500 px-2 sm:px-4 py-2.5 rounded light:bg-gray-900">
      <div class="flex items-center md:order-2 justify-end">
        <img src="images/language_icon.png" className="mr-2" />
        <Select
          className="appearance-none w-2/12"
          value={selectedLang}
          options={data}
          onChange={changeLanguageHandler}
        />
      </div>
    </nav>
  );
}
