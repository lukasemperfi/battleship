import React, { ComponentPropsWithoutRef, FC } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 33px;
  // overflow: hidden;
`;

export const GameBoardContainer: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  ...rest
}) => <Container {...rest}>{children}</Container>;
