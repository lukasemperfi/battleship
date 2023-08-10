import { Matrix, ShotResult } from "../board/boardTypes";
import { deepClone, delay, generateRandomNumber } from "@/utils/commonUtils";
import {
  Ship,
  ShipCoord,
  ShipCoords,
  ShipOrientation,
} from "../ships/shipsTypes";
import { DifficultyLevel, ShotInfo } from "./AIServiceTypes";

const getRandomShotCoords = (board: Matrix): ShipCoord | null => {
  const boardCoordinates = board.reduce<ShipCoord[]>((acc, raw, x) => {
    const rowCoords = raw.map<ShipCoord>((_, y) => [x, y]);
    return [...acc, ...rowCoords];
  }, []);

  const validShots = boardCoordinates.filter(([x, y]) =>
    isCellValidForShot(board, x, y)
  );

  if (validShots.length === 0) {
    return null;
  }

  const randomIndex = generateRandomNumber(validShots.length - 1);

  return validShots[randomIndex];
};

const isValidCoordsRange = (x: number, y: number) =>
  x >= 0 && x <= 9 && y >= 0 && y <= 9;

const isCellValidForShot = (board: Matrix, x: number, y: number) =>
  board[x][y] === ShotResult.Empty || board[x][y] === ShotResult.Ship;

const getShotCoordsAroundHit = (
  hitCoords: ShipCoords,
  board: Matrix
): ShipCoord | null => {
  if (hitCoords.length === 0) {
    return null;
  }
  const hitCoordsClone = deepClone(hitCoords);
  const ascendingHitCoords = hitCoordsClone.sort(
    (a, b) => a[0] - b[0] || a[1] - b[1]
  );

  const decks = ascendingHitCoords.length;
  const [x, y] = ascendingHitCoords[0];

  const possibleHitCoords = {
    [ShipOrientation.Horizontal]: [
      [x, y - 1],
      [x, y + decks],
    ],
    [ShipOrientation.Vertical]: [
      [x - 1, y],
      [x + decks, y],
    ],
  };

  let validCoords: ShipCoords = [];
  const getValidCoords = (possibleHitCoords: ShipCoords) => {
    return possibleHitCoords.filter(
      ([x, y]) => isValidCoordsRange(x, y) && isCellValidForShot(board, x, y)
    );
  };

  if (decks === 1) {
    validCoords = getValidCoords([
      ...possibleHitCoords[ShipOrientation.Horizontal],
      ...possibleHitCoords[ShipOrientation.Vertical],
    ]);
  } else {
    const isHorizontal = ascendingHitCoords[0][0] === ascendingHitCoords[1][0];

    const orientation = isHorizontal
      ? ShipOrientation.Horizontal
      : ShipOrientation.Vertical;
    validCoords = getValidCoords([...possibleHitCoords[orientation]]);
  }

  if (validCoords.length === 0) {
    return null;
  }

  const randomIndex = generateRandomNumber(validCoords.length - 1);

  const shotCoords = validCoords[randomIndex];
  const [shotX, shotY] = shotCoords;

  return [shotCoords[0], shotCoords[1]];
};

//shot algorithm
const generateValidDiagonalCoords = (
  startCoords: ShipCoord,
  board: Matrix
): ShipCoord[] => {
  const [startX, startY] = startCoords;
  const diagonalCoords: ShipCoord[] = [];

  let x = startX;
  let y = startY;

  while (isValidCoordsRange(x, y)) {
    if (isCellValidForShot(board, x, y)) {
      diagonalCoords.push([x, y]);
    }

    x--;
    y++;
  }

  return diagonalCoords;
};

const shotAlgorithm = (board: Matrix): ShipCoord | null => {
  const startPoints: ShipCoord[][] = [
    [
      [3, 0],
      [7, 0],
      [9, 2],
      [9, 6],
    ],
    [
      [1, 0],
      [5, 0],
      [9, 0],
      [9, 4],
      [9, 8],
    ],
  ];
  // const firstStageShotCoords = [
  //   [3, 0],
  //   [7, 0],
  //   [9, 2],
  //   [9, 6],
  //   [6, 9],
  //   [2, 9],
  //   [0, 7],
  //   [0, 3],
  // ];

  const secondAndThirdStageShotCoords = startPoints.reduce<ShipCoord[][][]>(
    (acc, secondStageCoords) => {
      const coords = secondStageCoords
        .reduce<ShipCoord[][]>((stageAcc, startCoords) => {
          const validCoords = generateValidDiagonalCoords(startCoords, board);
          if (validCoords.length > 0) {
            stageAcc.push(validCoords);
          }

          return stageAcc;
        }, [])
        .sort((a, b) => a.length - b.length);

      if (coords.length > 0) {
        acc.push(coords);
      }

      return acc;
    },
    []
  );

  // console.log("algorithm", secondAndThirdStageShotCoords);

  if (secondAndThirdStageShotCoords[0] === undefined) {
    return null;
  }

  return secondAndThirdStageShotCoords[0][0][0];

  // const boardClone = creatBoardMatrix(10, ShotResult.Empty);

  // FIRST STAGE
  // firstStageShotCoords.forEach(([x, y]) => {
  //   boardClone[x][y] = ShotResult.Ship;
  // });

  // SECOND STAGE

  // newCoords.forEach((coords) => {
  //   coords.forEach(([x, y]) => {
  //     boardClone[x][y] = ShotResult.Ship;
  //   });
  // });
};

const computerShot = async (
  hitCoords: ShipCoords | null,
  board: Matrix,
  difficultyLevel: DifficultyLevel = DifficultyLevel.EASY,
  shotDelay: number = 1000
): Promise<ShipCoord | null> => {
  await delay(shotDelay);

  let shotCoords: ShipCoord | null;

  if (hitCoords !== null) {
    shotCoords = getShotCoordsAroundHit(hitCoords, board);
  } else {
    shotCoords = getRandomShotCoords(board);
    // shotCoords = shotAlgorithm(board);

    // if (shotCoords === null) {
    //   shotCoords = getRandomShotCoords(board);
    // }
  }

  return shotCoords;
};

export {
  getRandomShotCoords,
  getShotCoordsAroundHit,
  computerShot,
  shotAlgorithm,
};
