import { Matrix, ShotResult } from "../board/boardTypes";
import { deepClone, delay, generateRandomNumber } from "@/utils/commonUtils";
import { ShipCoord, ShipCoords, ShipOrientation } from "../ships/shipsTypes";
import { DifficultyLevel } from "./AIServiceTypes";

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

  return [shotCoords[0], shotCoords[1]];
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
  }

  return shotCoords;
};

export { getRandomShotCoords, getShotCoordsAroundHit, computerShot };
