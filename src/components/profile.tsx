import { ArrowLeftOutlined } from "@ant-design/icons";
import { Gallery } from "./gallery";
import { Drawer } from "antd";
import styled from "styled-components";
import { Landmark } from "../types";
import { getYear } from "../utils/utils";
import { useTranslation } from "react-i18next";

interface ProfileProps {
  landmark: Landmark;
  active: boolean;
  onClose: () => void;
}

const CustomDrawer = styled(Drawer)`
  .customer-drawer-header {
    padding: 2vh 1vw;
  }
  color: black;

  h2 {
    font-size: 16px;
    margin-bottom: 0px;
  }

  p {
    margin-top: 0px;
  }

  section {
    padding-top: 20px;
  }
`;

const Profile = ({ landmark, active, onClose }: ProfileProps) => {
  const { t } = useTranslation();
  const citations = landmark.attribution?.split(",") ?? [];
  const paragraphs = landmark.description?.split("/n") ?? [];

  const citationText = citations?.length > 0 ? t("profile.citation") : "";

  return (
    <CustomDrawer
      title={landmark.name ?? ""}
      placement="right"
      onClose={onClose}
      open={active}
      className="custom-drawer-content"
      closeIcon={
        <ArrowLeftOutlined style={{ padding: "0px", fontSize: "22px" }} />
      }
      classNames={{ header: "customer-drawer-header" }}
    >
      <h2>
        {landmark.name}, {getYear(landmark.timeStart)} -{" "}
        {getYear(landmark.timeEnd)}
      </h2>
      <p>{landmark.location ?? ""}</p>
      <Gallery images={landmark.images ?? []} />
      <section>
        {paragraphs.map((paragrpah: string, id: number) => (
          <p key={id}>{paragrpah}</p>
        ))}
      </section>
      {citationText}
      {citations?.map((link: string, id: number) => (
        <a key={id} href={link}>
          ✿
        </a>
      ))}
    </CustomDrawer>
  );
};

export default Profile;
