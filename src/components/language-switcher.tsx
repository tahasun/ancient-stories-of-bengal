import { useTranslation } from "react-i18next";

interface Lang {
  code: string;
  name: string;
}

const languages: Record<string, Lang> = {
  en: { name: "English", code: "en" },
  bn: { name: "Bangla", code: "bn" },
};

// todo: lang detected bangla, need to set the button to detected lang as initial val
// todo: use a drop down for lang selector
// todo: add translations
export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  return (
    <div>
      {Object.keys(languages).map((lng) => (
        <button
          type="submit"
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          disabled={i18n.resolvedLanguage == lng}
        >
          {languages[lng].name}
        </button>
      ))}
    </div>
  );
};
