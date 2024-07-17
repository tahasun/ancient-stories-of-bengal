import { useEffect, useState } from "react";
import styled from "styled-components";
import { Image } from "../types";
import { useSwipeable } from "react-swipeable";

const SCROLL_TIME = 5 * 1000;

interface GalleryProps {
  images: Image[];
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

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const SlickWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 1vh 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const Gallery = (props: GalleryProps) => {
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

  const handleSwipeLeft = () => {
    clearInterval(_interval);
    setActiveTab((activeTab + 1) % props.images.length);
  };

  const handleSwipeRight = () => {
    clearInterval(_interval);

    let index = activeTab - 1;
    if (activeTab - 1 < 0) {
      index = props.images.length - 1;
    }

    setActiveTab(index % props.images.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: () => handleSwipeRight(),
  });

  const imgSrc = "images/" + props.images[activeTab]?.src;

  return (
    <Wrapper>
      <div {...handlers}>
        <StyledImage src={imgSrc ?? ""} />
      </div>
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
