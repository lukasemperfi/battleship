import { type FC } from "react";
import styled, { FlattenSimpleInterpolation, css } from "styled-components";
import { Ship as ShipView } from "./Ship";
import { ShipWrapper } from "./ShipWrapper";
import { type XYCoord, useDragLayer } from "react-dnd";
import { type Matrix } from "@/services/board/boardTypes";
import { type Ship } from "@/services/ships/shipsTypes";
import { canDropShip } from "@/services/placement/placementService";
import { useAppSelector } from "@/hooks/redux";
import {
  selectIsRotationNotAllowed,
  selectSelectedShip,
} from "@/store/playerBoardSlice";
import { ItemTypes } from "@/ItemTypes";

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
  itemOffset: XYCoord | null;
  isDragging: boolean;
}

interface ShipDragPreviewProps {
  board: Matrix;
  boardPosition: DOMRect | null;
}

export const ShipDragPreview: FC<ShipDragPreviewProps> = ({
  board,
  boardPosition,
}) => {
  const { item, itemType, itemOffset, isDragging } = useDragLayer<
    DragLayerProps,
    any
  >((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    itemOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

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

  const getStyles = (): FlattenSimpleInterpolation | undefined => {
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
