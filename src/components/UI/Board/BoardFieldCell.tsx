import { ShotResult } from "@/services/board/boardTypes";
import { ShipCoord } from "@/services/ships/shipsTypes";
import { ComponentPropsWithoutRef, FC, memo, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { MarkView } from "./MarkView";
import { ReactComponent as CircleIcon } from "@/assets/icons/circle.svg";
import { ReactComponent as CrossIcon } from "@/assets/icons/cross.svg";

const Cell = styled.div`
  // background-color: green;
  // border: 1px solid red;
  width: 33px;
  height: 33px;

  display: table-cell;
  text-align: center;
  border: none;
  border: 1px solid #ccc;
  vertical-align: middle;
  position: relative;
`;

// const activeStyle = css`
//   background-color: ${({ shotResult }) => cellColors[shotResult]};
// `;

// const CellContent = styled.div<{ shotResult: ShotResult }>`
//   background-color: ${({ shotResult }) => cellColors[shotResult]};
//   width: 100%;
//   height: 100%;
// `;

const CellContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type CellColors = {
  [key in ShotResult]: string;
};

const cellColors: CellColors = {
  [ShotResult.Empty]: "white",
  [ShotResult.Miss]: "gray",
  [ShotResult.Hit]: "red",
  [ShotResult.Ship]: "none",
};

const Circle = styled.div`
  width: 16px;
  height: 16px;
  background-color: blue;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

interface BoardFieldCellProps extends ComponentPropsWithoutRef<"div"> {
  shotResult: ShotResult;
  coords: ShipCoord;
  onCellClick?: (coords: ShipCoord, shotResult: ShotResult) => void;
}

export const BoardFieldCell: FC<BoardFieldCellProps> = memo(
  ({ onCellClick, shotResult, coords }) => {
    const handleOnCellClick = (): void => {
      if (onCellClick) {
        onCellClick(coords, shotResult);
      }
    };

    return (
      <Cell onClick={handleOnCellClick}>
        <CellContent>
          {shotResult === ShotResult.Miss && (
            <CircleIcon width={16} height={16} fill="#1f3a93" />
          )}
          {shotResult === ShotResult.Hit && (
            <CrossIcon width={25} height={25} fill="#f62459" />
          )}
        </CellContent>
      </Cell>
    );
  }
);
