import React, { FC } from "react";
import styled, { css } from "styled-components";
import { Ship as ShipView } from "./Ship";
import { ShipWrapper } from "./ShipWrapper";
import { XYCoord, useDragLayer } from "react-dnd";
import { Matrix } from "@/services/board/boardTypes";
import { Ship } from "@/services/ships/shipsTypes";
import { canDropShip } from "@/services/placement/placementService";
import { useAppSelector } from "@/hooks/redux";
import {
  selectIsRotationNotAllowed,
  selectSelectedShip,
} from "@/store/playerBoardSlice";
import { ItemTypes } from "@/ItemTypes";

//  box-shadow: 0 0 4px 4px rgb(0 128 0 / 58%);

const canDropStyle = css`
  box-shadow: 0 0 4px 4px rgb(0 128 0 / 58%);
`;

const cannotDropStyle = css`
  box-shadow: 0 0 4px 4px rgb(255 0 0 / 58%);
`;

const Wrapper = styled.div`
  position: fixed;
  pointer-events: none;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

interface DragLayerProps {
  item: Ship | null;
  itemType: string | symbol | null;
  initialOffset: XYCoord | null;
  itemOffset: XYCoord | null;
  isDragging: boolean;
  delta: XYCoord | null;
  sourceClientOffset: XYCoord | null;
}

interface ShipDragPreviewProps {
  board: Matrix;
  boardPosition: DOMRect | null;
}

export const ShipDragPreview: FC<ShipDragPreviewProps> = ({
  board,
  boardPosition,
}) => {
  const {
    item,
    itemType,
    initialOffset,
    itemOffset,
    isDragging,
    delta,
    sourceClientOffset,
  } = useDragLayer<DragLayerProps, any>((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    itemOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
    delta: monitor.getDifferenceFromInitialOffset(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }));

  const selectedShip = useAppSelector(selectSelectedShip);
  const isRotationAllowed = useAppSelector(selectIsRotationNotAllowed);

  if (!isDragging || itemType !== ItemTypes.SHIP) {
    return null;
  }

  const getPosition = () => {
    if (!itemOffset || !item) {
      return null;
    }
    const { x, y } = itemOffset;

    return { top: y, left: x, orientation: item.placement.orientation };
  };

  const getStyles = () => {
    if (!item) {
      return;
    }

    const isDecksMoreOne = item.coords.length > 1;

    return css`
      border-radius: ${isDecksMoreOne ? "15px" : "5px"};
      ${isDragging &&
      (canDropShip(board, boardPosition, item, itemOffset)
        ? canDropStyle
        : cannotDropStyle)}
    `;
  };

  const getShipViewStyles = () => {
    if (!item) {
      return;
    }

    const isDecksMoreOne = item.coords.length > 1;

    return css`
      border-radius: ${isDecksMoreOne ? "15px" : "5px"};
    `;
  };

  return (
    <Wrapper>
      <ShipWrapper position={getPosition()} styles={getStyles()}>
        <ShipView width={item?.width} styles={getShipViewStyles()} />
      </ShipWrapper>
    </Wrapper>
  );
};
