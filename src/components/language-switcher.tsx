import { useTranslation } from "react-i18next";
import { languages, uiStore } from "../stores/ui.store";
import { observer } from "mobx-react-lite";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2vmin;
  margin-left: auto;

  > button {
    padding: 0.4em 1em;
    height: 100%;
    color: grey;
    background-color: lightgrey;
  }

  > button:first-child {
    border-radius: 8px 0px 0px 8px;
    border-right: 1px solid lightgrey;
  }

  > button:last-child {
    border-radius: 0px 8px 8px 0px;
  }

  > button:disabled {
    color: #0096ff;
    background-color: white;
    border: 1px solid #0096ff;
  }
`;

export const LanguageSwitcher = observer(() => {
  const { i18n } = useTranslation();

  return (
    <Wrapper>
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
    </Wrapper>
  );
});
