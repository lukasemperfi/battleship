import React, { FC } from "react";
import styled from "styled-components";
import { useBoardContext } from "./Board";
import { v4 as uuidv4 } from "uuid";
import { Matrix, ShotResult } from "@/services/board/boardTypes";
import { ShipCoord } from "@/services/ships/shipsTypes";
import { BoardFieldCell } from "./BoardFieldCell";

const Table = styled.div`
  display: flex;
  flex-wrap: wrap;
  // width: 330px;
  // height: 330px;
  // background-color: red;
  // opacity: 0.5;

  display: table;
  border-collapse: collapse;
  width: 331px;
  height: 331px;
`;

const Row = styled.div`
  display: table-row;
`;

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
`;

const CellContent = styled.div<{ shotResult: ShotResult }>`
  background-color: ${({ shotResult }) => cellColors[shotResult]};
  width: 100%;
  height: 100%;
  transition: 0.3s;
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

export interface BoardFieldProps {
  board: Matrix;
  onCellClick?: (coords: ShipCoord, shotResult: ShotResult) => void;
}

export const BoardField: FC<BoardFieldProps> = ({ board, onCellClick }) => {
  return (
    <Table>
      {board.map((row, x) => (
        <Row key={uuidv4()}>
          {row.map((shotResult, y) => (
            <BoardFieldCell
              key={uuidv4()}
              shotResult={shotResult}
              coords={[x, y]}
              onCellClick={onCellClick}
            />
          ))}
        </Row>
      ))}
    </Table>
  );
};
