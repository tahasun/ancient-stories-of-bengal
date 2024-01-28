import { useEffect, useState } from "react";
import styled from "styled-components";
import { IImage } from "../utils/types";

const SCROLL_TIME = 5 * 1000;
export const BASE_URL = "stories-of-our-land";

interface GalleryProps {
  images: IImage[];
}

const Slick = styled.li`
  height: 4px;
  width: 2vw;
  background-color: rgba(0, 0, 0, 0.2);
  margin: 0px 4px;
  border-radius: 10px;

  &.active-slick {
    width: 4vw;
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Link = styled.a`
  font-size: 14px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  background-color: pink;
`;

const SlickWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1vh 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Gallery = (props: GalleryProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [_interval, _setInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (props.images.length > 0) {
      const interval = setInterval(() => {
        setActiveTab((prevTabIdx) => (prevTabIdx + 1) % props.images.length);
      }, SCROLL_TIME);

      _setInterval(interval);
      return () => {
        clearInterval(interval);
      };
    }
  }, [props.images]);

  const handleClick = (index: number) => {
    clearInterval(_interval);
    setActiveTab(index);
  };

  // const imgSrc = import.meta.env.PROD
  //   ? BASE_URL + props.images[activeTab]?.src
  //   : props.images[activeTab]?.src;

  return (
    <Wrapper>
      <Image src={props.images[activeTab]?.src ?? ""} />
      <Link href={props.images[activeTab]?.link ?? ""}>
        ©{props.images[activeTab]?.attribution ?? ""}
      </Link>
      <SlickWrapper>
        {props.images.map((_, index) => (
          <Slick
            key={index}
            onClick={() => handleClick(index)}
            className={activeTab === index ? "active-slick" : ""}
          />
        ))}
      </SlickWrapper>
    </Wrapper>
  );
};

export default Gallery;
