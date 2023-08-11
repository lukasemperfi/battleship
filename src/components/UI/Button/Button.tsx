import { ComponentPropsWithoutRef, FC } from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  border: 2px solid #1f3a93;
  padding: 10px;
  border-radius: 15px;
  font-weight: 600;
  color: #1f3a93;
`;

export const Button: FC<ComponentPropsWithoutRef<"button">> = ({
  children,
  ...rest
}) => <StyledButton {...rest}>{children}</StyledButton>;
