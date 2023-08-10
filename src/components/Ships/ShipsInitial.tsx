import { type FC } from "react";
import { DraggableShip } from "@/components/UI/Ship/DraggableShip";
import { Ship } from "@/services/ships/shipsTypes";
import styled from "styled-components";

interface ShipsInitialProps {
  ships: Ship[];
}

const Ul = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 33px;
`;

const Li = styled.li`
  height: 33px;
  width: 100%;
  position: relative;
  display: flex;
    gap: 33px;
}
`;

const ShipWrapper = styled.div<{ width: number }>`
  position: relative;
  width: ${({ width }) => `${width}px`};
`;

export const ShipsInitial: FC<ShipsInitialProps> = ({ ships }) => {
  const getRenderItems = (shipCount: number, gap: number = 33) => {
    return ships
      .filter((ship) => ship.coords.length === shipCount)
      .map((ship, i) => {
        return (
          // <ShipWrapper left={gap * i + ship.width * i} key={ship.id}>
          <ShipWrapper width={ship.width} key={ship.id}>
            {!ship.isShipPlaced && <DraggableShip draggableItem={ship} />}
          </ShipWrapper>
        );
      });
  };

  return (
    <Ul>
      <Li>{getRenderItems(4)}</Li>
      <Li>{getRenderItems(3)}</Li>
      <Li>{getRenderItems(2)}</Li>
      <Li>{getRenderItems(1)}</Li>
    </Ul>
  );
};
