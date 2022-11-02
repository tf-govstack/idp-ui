import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { supportedLanguages } from "../constants/clientConstants";

export default function NavHeader({ localStorageService }) {
  const { i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(null);

  const { setLanguage } = {
    ...localStorageService,
  };

  const changeLanguageHandler = (e) => {
    i18n.changeLanguage(e.value);
    setLanguage(e.value);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  const data = [];

  for (let lang in supportedLanguages) {
    data.push({
      label: supportedLanguages[lang],
      value: lang,
    });
  }

  return (
    <nav class="bg-white border-gray-500 shadow px-2 sm:px-4 py-2">
      <div class="flex items-center md:order-2 justify-end">
        <img src="images/language_icon.png" className="mr-2" />
        <Select
          styles={customStyles}
          isSearchable={false}
          className="appearance-none"
          value={selectedLang}
          options={data}
          placeholder="Language"
          onChange={changeLanguageHandler}
        />
      </div>
    </nav>
  );
}
