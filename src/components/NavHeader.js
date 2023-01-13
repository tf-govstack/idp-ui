import { useTranslation } from "react-i18next";
import Select from "react-select";

export default function NavHeader({ langOptions }) {
  const { i18n } = useTranslation();

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

  return (
    <nav className="bg-white border-gray-500 shadow px-2 sm:px-4 py-2">
      <div className="flex items-center md:order-2 justify-end">
        <img src="images/language_icon.png" className="mx-2" />
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
