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

  > button:first-child {
    border-radius: 8px 0px 0px 8px;
    border-right: 1px solid lightgrey;
  }

  > button:last-child {
    border-radius: 0px 8px 8px 0px;
  }
`;

const Button = styled.button<{ $active: boolean }>`
  padding: 0.4em 1em;
  height: 100%;
  color: ${({ $active }) => ($active ? "#0096ff" : "grey")};
  background-color: ${({ $active }) =>
    $active ? "white" : "rgba(255,255,255,0.5)"};
  ${({ $active }) => ($active ? "border: 1px solid #0096ff;" : "")}
`;

export const LanguageSwitcher = observer(() => {
  const { i18n } = useTranslation();

  return (
    <Wrapper>
      {Object.keys(languages).map((lng) => (
        <Button
          type="submit"
          key={lng}
          onClick={() => uiStore.switchLang(lng)}
          $active={i18n.resolvedLanguage == lng}
          disabled={i18n.resolvedLanguage == lng}
        >
          {languages[lng].tongue}
        </Button>
      ))}
    </Wrapper>
  );
});
