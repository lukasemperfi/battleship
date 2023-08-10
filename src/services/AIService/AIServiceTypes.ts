import { ShotResult } from "../board/boardTypes";
import { ShipCoord } from "../ships/shipsTypes";

enum DifficultyLevel {
  EASY = "easy",
  HARD = "hard",
}

interface ShotInfo {
  coords: ShipCoord;
  shotResult: ShotResult;
}

export { DifficultyLevel, type ShotInfo };
