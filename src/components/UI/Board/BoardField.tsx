import { FC } from "react";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { Matrix, ShotResult } from "@/services/board/boardTypes";
import { ShipCoord } from "@/services/ships/shipsTypes";
import { BoardFieldCell } from "./BoardFieldCell";

const Table = styled.div`

  display: table;
  border-collapse: collapse;
  width: 331px;
  height: 331px;
`;

const Row = styled.div`
  display: table-row;
`;






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
