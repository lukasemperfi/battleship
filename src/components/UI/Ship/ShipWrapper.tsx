import React, {
  CSSProperties,
  ComponentPropsWithRef,
  FC,
  ReactNode,
  forwardRef,
} from "react";
import styled, { FlattenSimpleInterpolation } from "styled-components";
import { DraggableItemPosition } from "./DraggableShip";
import { ShipOrientation } from "@/services/ships/shipsTypes";

const transform = {
  [ShipOrientation.Horizontal]: "rotate(0deg)",
  [ShipOrientation.Vertical]: "rotate(90deg)",
};

type WrapperProps = Omit<ShipWrapperProps, "children">;

const Wrapper = styled.div.attrs<WrapperProps>(({ position }) => ({
  style:
    position !== null
      ? {
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: transform[position.orientation],
          transformOrigin:
            position.orientation === ShipOrientation.Horizontal
              ? ""
              : "16.5px 16.5px",
        }
      : undefined,
}))<WrapperProps>`
  position: absolute;
  transition: transform 0.3s, transform-origin 0.3s;
  ${(props) => props.styles};
  // z-index: -1;
`;

export interface ShipWrapperProps extends ComponentPropsWithRef<"div"> {
  position: DraggableItemPosition | null;
  children: ReactNode;
  styles?: FlattenSimpleInterpolation;
}

export const ShipWrapper = forwardRef<HTMLDivElement, ShipWrapperProps>(
  ({ position, children, styles, ...rest }, ref) => {
    if (!position) {
      return null;
    }
    // console.log(position.orientation);

    return (
      <Wrapper ref={ref} position={position} styles={styles} {...rest}>
        {children}
      </Wrapper>
    );
  }
);
