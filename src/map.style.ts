import styled from "styled-components";

export const CopyrightLicense = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  backgroundcolor: hsla(0, 0%, 100%, 0.5);
  padding: 0 5px;
  font: 12px/20px Helvetica Neue, Arial, Helvetica, sans-serif;
`;

export const Link = styled.a`
  textdecoration: none;
  color: rgba(0, 0, 0, 0.75);
  cursor: grab;
`;

export const HoverInfo = styled.div`
  cursor: pointer;
`;

export const PlayAnimation = styled.div<{ $active: boolean }>`
  color: ${(props) => (props.$active ? "#0096ff" : "rgba(0,0,0,0.3)")};
`;

export const ControlWrapper = styled.div`
  position: absolute;
  right: 2vw;
  bottom: 5vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  cursor: pointer;
  font-size: 26px;
  font-style: bolder;
  color: #0096ff;

  > span {
    margin: 4px 0px;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const TopBar = styled.div`
  position: absolute;
  left: 26vw;
  top: 4vh;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const CircularWrapper = styled.div`
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background-color: #0096ff;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  margin: 0 10px;
`;