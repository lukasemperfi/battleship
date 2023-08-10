import styled from "styled-components";

import boardBackgroundImg from "@/assets/img/bg_play_field.png";
import { forwardRef, type FC, type ReactNode } from "react";
import { createContext } from "@/hooks/context";
import { useDrop } from "react-dnd";
import { ItemTypes } from "@/ItemTypes";
import { ReactComponent as AIIcon } from "@/assets/icons/ai.svg";
import { ReactComponent as PlayerIcon } from "@/assets/icons/player.svg";
import { CurrentPlayer } from "@/store/gameSlice";

export const [BoardContextProvider, useBoardContext] =
  createContext<BoardProps>();

const Background = styled.div`
  // width: 366px;
  // height: 363px;
  // flex-shrink: 0;
  // position: relative;
  // background: url(${boardBackgroundImg}) no-repeat;

  width: 340px;
  height: 340px;
  flex-shrink: 0;
  position: relative;
  // border: 4px solid blue;
  // border-radius: 4px;
`;

const Wrapper = styled.div`
  position: relative;
  // width: 330px;
  // height: 330px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0px;
`;

export interface BoardProps {
  children?: ReactNode;
  currentPlayer?: CurrentPlayer;
  activePlayer?: CurrentPlayer;
}

type IconVariants = {
  [key in CurrentPlayer]: JSX.Element;
};

export const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children, currentPlayer, activePlayer }, ref) => {
    const iconColor = activePlayer === currentPlayer ? "green" : "#a8a8a8";

    const iconVariants: IconVariants = {
      [CurrentPlayer.PLAYER]: (
        <PlayerIcon width={29} height={29} fill={iconColor} />
      ),
      [CurrentPlayer.COMPUTER]: (
        <AIIcon width={31} height={31} fill={iconColor} />
      ),
    };

    return (
      // <Background>
      <div>
        <Wrapper ref={ref}>{children}</Wrapper>
        {currentPlayer && (
          <IconWrapper>{iconVariants[currentPlayer]}</IconWrapper>
        )}
      </div>

      // </Background>
    );
  }
);
