enum ShotResult {
  Hit = 3,
  Miss = 1,
  Empty = 0,
  Ship = 2,
}

type Matrix = ShotResult[][];

interface LocationCheckArea {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
}

export { ShotResult, type Matrix, type LocationCheckArea };
