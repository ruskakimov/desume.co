import styled from "styled-components";

// TODO: Move internal state to props
// TODO: Make props required
interface DivisionSlidersProps {
  divisions?: number[];
  onChange?: (changedDivisions: number[]) => void;
}

/**
 * Controlled input for redistributing the total quantity between two or more divisions.
 */
export default function DivisionSliders({}: DivisionSlidersProps) {
  return (
    <Container>
      <Handle />
    </Container>
  );
}

const Container = styled.div`
  width: 400px;
  height: 100px;
  margin: 0 auto;
  outline: 1px solid black;
`;

const Handle = styled.div`
  width: 10px;
  height: 100%;
  background-color: blue;

  &:hover {
    cursor: ew-resize;
  }
`;
