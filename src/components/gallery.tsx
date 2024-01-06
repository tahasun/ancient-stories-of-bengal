import { useState } from "react";
import styled from "styled-components";

interface GalleryProps {
  images: string[];
}

const Gallery = (props: GalleryProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  return (
    <Wrapper>
      <Image src={props.images[activeTab]} />
      <SlickWrapper>
        {props.images.map((_, index) => (
          <Slick
            key={index}
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? "active-slick" : ""}
          />
        ))}
      </SlickWrapper>
    </Wrapper>
  );
};

const Slick = styled.li`
  height: 4px;
  width: 2vw;
  background-color: black;
  margin: 0px 4px;

  &.active-slick {
    width: 4vw;
    background-color: grey;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Image = styled.img`
  width: 20vw;
  height: 20vh;
  background-color: pink;
`;
const SlickWrapper = styled.ul`
  list-style-type: none; /* Remove bullets */
  padding: 0; /* Remove padding */
  margin: 1vh 0; /* Remove margins */
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default Gallery;
