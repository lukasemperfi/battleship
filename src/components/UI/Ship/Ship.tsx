import { type FC } from "react";
import styled, { type FlattenSimpleInterpolation } from "styled-components";

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
  ${(props) => props.styles};
`;

export const Ship: FC<ShipProps> = ({ width, styles }) => {
  return <Container width={width} styles={styles} />;
};
