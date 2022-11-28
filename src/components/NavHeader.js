import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";

export default function NavHeader({ langConfigService }) {
  const { i18n } = useTranslation();
  const { getLocaleConfiguration } = {
    ...langConfigService,
  };

  const [langOptions, setLangOptions] = useState([]);

  const changeLanguageHandler = (e) => {
    i18n.changeLanguage(e.value);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      boxShadow: "none",
    }),
  };

  useEffect(() => {
    try {
      getLocaleConfiguration().then((response) => {
        let lookup = {};
        let supportedLanguages = response.languages;
        let langData = [];
        for (let lang in supportedLanguages) {
          //check to avoid duplication language labels
          if (!(supportedLanguages[lang] in lookup)) {
            lookup[supportedLanguages[lang]] = 1;
            langData.push({
              label: supportedLanguages[lang],
              value: lang,
            });
          }
        }
        setLangOptions(langData);
      });
    } catch (error) {
      console.error("Failed to load i18n bundle!");
    }
  }, []);

  return (
    <nav class="bg-white border-gray-500 shadow px-2 sm:px-4 py-2">
      <div class="flex items-center md:order-2 justify-end">
        <img src="images/language_icon.png" className="mr-2" />
        <Select
          styles={customStyles}
          isSearchable={false}
          className="appearance-none"
          value={null}
          options={langOptions}
          placeholder="Language"
          onChange={changeLanguageHandler}
        />
      </div>
    </nav>
  );
}
