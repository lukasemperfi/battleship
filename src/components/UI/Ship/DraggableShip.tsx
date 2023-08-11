import { FC, useEffect } from "react";
import { css } from "styled-components";
import { useDrag } from "react-dnd";
import { ItemTypes } from "@/ItemTypes";

import { ShipWrapper } from "./ShipWrapper";
import { getEmptyImage } from "react-dnd-html5-backend";
import { Ship as ShipView } from "./Ship";
import { Ship, ShipOrientation } from "@/services/ships/shipsTypes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  selectSelectedShip,
  setIsRotationNotAllowed,
  setSelectedShip,
} from "@/store/playerBoardSlice";
import { ShipRotatePreview } from "./ShipRotatePreview";
import { selectGameState } from "@/store/gameSlice";

interface DraggableShipProps {
  draggableItem: Ship;
}

export interface DraggableItemPosition {
  top: number;
  left: number;
  orientation: ShipOrientation;
}

interface CollectProps {
  isDragging: boolean;
}

export const DraggableShip: FC<DraggableShipProps> = ({ draggableItem }) => {
  const dispatch = useAppDispatch();
  const selectedShip = useAppSelector(selectSelectedShip);
  const { isGameStarted } = useAppSelector(selectGameState);

  const {
    position,
    placement: { orientation },
    width,
  } = draggableItem;

  const [{ isDragging }, drag, preview] = useDrag<Ship, unknown, CollectProps>(
    () => ({
      type: ItemTypes.SHIP,
      item: draggableItem,

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      canDrag: () => !isGameStarted,
    }),
    [draggableItem, isGameStarted]
  );

  const getShipWrapperStyles = () => {
    const isSelectedShip = draggableItem.id === selectedShip?.id;
    const isDecksMoreOne = draggableItem.coords.length > 1;

    return css`
      opacity: ${isDragging ? "0" : "1"};
      height: ${isDragging ? "0" : "auto"};
      border-radius: ${isDecksMoreOne ? "15px" : "5px"};
      box-shadow: ${isSelectedShip
        ? "0 0 4px 4px rgb(115 135 247 / 58%)"
        : "none"};
    `;
  };

  const getShipViewStyles = () => {
    const isDecksMoreOne = draggableItem.coords.length > 1;

    return css`
      border-radius: ${isDecksMoreOne ? "15px" : "5px"};
    `;
  };

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  const handleShipClick = () => {
    const isCurrentShipSelected = draggableItem.id === selectedShip?.id;

    if (
      draggableItem.isShipPlaced &&
      !isCurrentShipSelected &&
      !isGameStarted
    ) {
      dispatch(setIsRotationNotAllowed(false));
      dispatch(setSelectedShip(draggableItem));
    }
  };

  return (
    <>
      <ShipWrapper
        ref={drag}
        position={{ ...position, orientation }}
        styles={getShipWrapperStyles()}
        onClick={handleShipClick}
      >
        <ShipView width={width} styles={getShipViewStyles()} />
      </ShipWrapper>
      {selectedShip?.id === draggableItem.id && (
        <ShipRotatePreview draggableItem={draggableItem} />
      )}
    </>
  );
};
