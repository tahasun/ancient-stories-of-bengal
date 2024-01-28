import styled from "styled-components";
import { ILandmark } from "../utils/types";
import { BASE_URL } from "./gallery";

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  border-top-left-radius: 0px;
  width: 12vw;
  height: auto;
  padding: 10px;
  margin-top: 20px;

  h2 {
    font-size: 12px;
    padding: 0;
    color: rgba(0, 0, 0, 0.7);
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
`;

const ProfilePreview = ({ landmark }: { landmark: ILandmark }) => {
  // const imgSrc = import.meta.env.PROD
  //   ? BASE_URL + landmark.images[0].src
  //   : landmark.images[0].src;

  return (
    <Container>
      <h2>{landmark.name}</h2>
      <Img src={landmark.images[0].src} />
    </Container>
  );
};

export default ProfilePreview;
