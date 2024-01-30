import { HomeFilled } from "@ant-design/icons";
import { Select } from "antd";
import { CircularWrapper, TopSection } from "./map.style";
import * as landmarkData from "../data/landmarks.json";

const landmarkOptions = landmarkData.landmarks.map((landmark) => {
  return { value: landmark.id, label: landmark.name };
});

interface TopBarProps {
  resetCameraHandler: () => void;
  selectLandmarkHandler: (val: string) => void;
  searchVal: string;
}

export const TopBar = ({
  resetCameraHandler,
  selectLandmarkHandler,
  searchVal,
}: TopBarProps) => {
  return (
    <TopSection>
      <CircularWrapper>
        <HomeFilled onClick={resetCameraHandler} />
      </CircularWrapper>

      <Select
        showSearch
        style={{ width: "100%" }}
        placeholder="Search for a landmark..."
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
    </TopSection>
  );
};
