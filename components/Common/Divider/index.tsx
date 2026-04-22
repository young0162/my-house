interface DividerProps {
  height?: number;
}

const Divider = ({ height = 16 }: DividerProps) => {
  return <div style={{ height }} />;
};

export default Divider;
