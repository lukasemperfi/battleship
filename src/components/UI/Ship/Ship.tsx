import { type FC } from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";

import { SHIP_SIDE } from "@/config/gameConfig";


export interface ShipProps {
  width?: number;
  styles?: FlattenSimpleInterpolation;
}

const Container = styled.div.attrs<ShipProps>(({ width }) => ({
  style: {
    width: width && `${width}px`,
  },
}))<ShipProps>`
  height: 33px;
  border: 2px solid #0c0ce5;
  // background-color: yellow;
  ${(props) => props.styles};
`;

export const Ship: FC<ShipProps> = ({ width, styles }) => {
  return <Container width={width} styles={styles} />;
};
