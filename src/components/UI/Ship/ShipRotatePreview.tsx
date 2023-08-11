import { type FC, useEffect } from "react";
import { ShipWrapper } from "./ShipWrapper";
import { Ship as ShipView } from "./Ship";
import { type Ship } from "@/services/ships/shipsTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectIsRotationNotAllowed,
  setIsRotationNotAllowed,
} from "@/store/playerBoardSlice";
import { FlattenSimpleInterpolation, css, keyframes } from "styled-components";
import { toogleRotate } from "@/services/placement/placementService";

const fadeInOut = keyframes`
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
`;

const shipRotatePreviewStyle = css`
  border: none;
`;

interface ShipRotatePreviewProps {
  draggableItem: Ship;
}

export const ShipRotatePreview: FC<ShipRotatePreviewProps> = ({
  draggableItem,
}) => {
  const {
    position,
    placement: { orientation },
    width,
  } = draggableItem;

  const dispatch = useAppDispatch();
  const isRotationNotAllowed = useAppSelector(selectIsRotationNotAllowed);

  const getStylesRotate = (): FlattenSimpleInterpolation =>
    isRotationNotAllowed
      ? css`
          opacity: 1;
          visibility: visible;
          z-index: 1;
          box-shadow: 0 0 3px 3px rgb(245 0 0 / 58%);
          animation: ${fadeInOut};
          animation-fill-mode: both;
          animation-duration: 0.9s;
          border-radius: 15px;
        `
      : css`
          opacity: 0;
          visibility: hidden;
          box-shadow: 0 0 3px 3px rgb(245 0 0 / 58%);
        `;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRotationNotAllowed) {
      timer = setTimeout(() => {
        dispatch(setIsRotationNotAllowed(false));
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isRotationNotAllowed]);

  return (
    <ShipWrapper
      position={{ ...position, orientation: toogleRotate(orientation) }}
      styles={getStylesRotate()}
    >
      <ShipView width={width} styles={shipRotatePreviewStyle} />
    </ShipWrapper>
  );
};
