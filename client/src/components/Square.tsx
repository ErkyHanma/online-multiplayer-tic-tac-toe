type SquareProps = {
  value: string;
  OnClick: () => void;
};

const Square = ({ value, OnClick }: SquareProps) => {
  return (
    <div
      onClick={OnClick}
      className="border flex items-center relative justify-center w-full h-full  hover:bg-gray-900"
    >
      <span className="absolute">{value}</span>
    </div>
  );
};

export default Square;
