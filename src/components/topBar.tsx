import { HomeFilled } from "@ant-design/icons";
import { Select } from "antd";
import { CircularWrapper, TopSection } from "./map.style";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { landmarkStore } from "../stores/landmark-store";
import { uiStore } from "../stores/ui.store";
import { LanguageSwitcher } from "./language-switcher";

interface TopBarProps {
  resetCameraHandler: () => void;
  selectLandmarkHandler: (val: string) => void;
  searchVal: string;
}

export const TopBar = observer(
  ({ resetCameraHandler, selectLandmarkHandler, searchVal }: TopBarProps) => {
    const { t } = useTranslation();

    const landmarkOptions = useMemo(() => {
      const landmarks = landmarkStore.getLandmarks(uiStore.curLangCode);
      return landmarks.map((landmark) => ({
        value: landmark.id,
        label: landmark.name,
      }));
    }, [uiStore, landmarkStore]);

    return (
      <TopSection>
        <CircularWrapper>
          <HomeFilled onClick={resetCameraHandler} />
        </CircularWrapper>

        <Select
          showSearch
          style={{ width: "80%" }}
          placeholder={t("topbar.search.placeholder-text")}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={landmarkOptions}
          onSelect={(val) => selectLandmarkHandler(val)}
          value={searchVal}
        />
        <LanguageSwitcher />
      </TopSection>
    );
  }
);
