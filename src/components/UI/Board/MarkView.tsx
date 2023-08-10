import { motion } from "framer-motion";
import React, { FC } from "react";
import styled from "styled-components";

const Circle = styled(motion.div)`
  width: 16px;
  height: 16px;
  background-color: blue;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
`;

interface MarkViewProps {
  active: boolean;
}

// const variants = {
//   open: { scale: 1 },
//   closed: { scale: 0 },
// };

export const MarkView: FC<MarkViewProps> = ({ active }) => {
  console.log("active", active);

  return (
    <>
      {active ? (
        <Circle
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      ) : null}
    </>
  );
};
