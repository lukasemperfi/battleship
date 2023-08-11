import { type ComponentPropsWithoutRef, type FC } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 800px;
  margin: 0 auto;
`;

export const PageContainer: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  ...rest
}) => <Container {...rest}>{children}</Container>;
