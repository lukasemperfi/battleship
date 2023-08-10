import shipImage from "@/assets/img/sprite.png";

enum ShipName {
  Battleship = "battleship",
  Cruiser = "cruiser",
  Destroyer = "destroyer",
  Submarine = "submarine",
}

interface ShipDataObj {
  decks: number;
  count: number;
  side: number;
}

type ShipDataTest = Record<ShipName, ShipDataObj>;

interface ShipData {
  name: ShipName;
  decks: number;
  count: number;
  side: number;
}

const IMAGE_SPRITE_POSITIONS = {
  ships: {
    [ShipName.Battleship]: {
      x: "0px",
      y: "0px",
    },
    [ShipName.Cruiser]: {
      x: "-150px",
      y: "0px",
    },
    [ShipName.Destroyer]: {
      x: "270px",
      y: "0px",
    },
    [ShipName.Submarine]: {
      x: "-360px",
      y: "0px",
    },
  },
};

const MATRIX_LENGTH = 10;
const FIELD_SIDE = 330;
const SHIP_SIDE = 33;
const CELL_BORDER = 1;
const SHIP_DATA_TEST: ShipDataTest = {
  [ShipName.Battleship]: {
    decks: 4,
    count: 1,
    side: SHIP_SIDE,
  },
  [ShipName.Cruiser]: {
    decks: 3,
    count: 2,
    side: SHIP_SIDE,
  },
  [ShipName.Destroyer]: {
    decks: 2,
    count: 3,
    side: SHIP_SIDE,
  },
  [ShipName.Submarine]: {
    decks: 1,
    count: 4,
    side: SHIP_SIDE,
  },
};

const SHIP_DATA: ShipData[] = [
  {
    name: ShipName.Battleship,
    decks: 4,
    count: 1,
    side: SHIP_SIDE,
  },
  {
    name: ShipName.Cruiser,
    decks: 3,
    count: 2,
    side: SHIP_SIDE,
  },
  {
    name: ShipName.Destroyer,
    decks: 2,
    count: 3,
    side: SHIP_SIDE,
  },
  {
    name: ShipName.Submarine,
    decks: 1,
    count: 4,
    side: SHIP_SIDE,
  },
];

export {
  MATRIX_LENGTH,
  FIELD_SIDE,
  SHIP_SIDE,
  SHIP_DATA,
  ShipName,
  type ShipData,
  IMAGE_SPRITE_POSITIONS,
  SHIP_DATA_TEST,
  CELL_BORDER,
};
