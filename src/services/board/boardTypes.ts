enum ShotResult {
  Hit = "hit",
  Miss = "miss",
  Empty = "□",
  Ship = "■",
}

type Matrix = ShotResult[][];

interface LocationCheckArea {
  fromX: number;
  toX: number;
  fromY: number;
  toY: number;
}

export { ShotResult, type Matrix, type LocationCheckArea };
