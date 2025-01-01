type SquareProps = {
  value: string;
  OnClick: () => void;
  isYourTurn: boolean;
};

const Square = ({ value, OnClick, isYourTurn }: SquareProps) => {
  return (
    <div
      onClick={OnClick}
      className={`border flex items-center relative justify-center w-full h-full   ${isYourTurn && "hover:bg-gray-900 cursor-pointer"}`}
    >
      <span className="absolute">{value}</span>
    </div>
  );
};

export default Square;
