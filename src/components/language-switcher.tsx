import { useTranslation } from "react-i18next";
import { languages, uiStore } from "../stores/ui.store";
import { observer } from "mobx-react-lite";

// todo: use a drop down for lang selector
// todo: add translations
export const LanguageSwitcher = observer(() => {
  const { i18n } = useTranslation();

  return (
    <div>
      {Object.keys(languages).map((lng) => (
        <button
          type="submit"
          key={lng}
          onClick={() => uiStore.switchLang(lng)}
          disabled={i18n.resolvedLanguage == lng}
        >
          {languages[lng].tongue}
        </button>
      ))}
    </div>
  );
});
