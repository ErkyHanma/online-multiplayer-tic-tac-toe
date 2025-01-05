type SquareProps = {
  value: string;
  OnClick: () => void;
  isYourTurn?: boolean;
};

const Square = ({ value, OnClick, isYourTurn }: SquareProps) => {
  return (
    <div
      onClick={OnClick}
      className={`relative flex h-full w-full items-center justify-center border border-gray-950 hover:bg-gray-300 dark:border-gray-700 dark:hover:bg-gray-900 ${isYourTurn && "cursor-pointer"}`}
    >
      <span className="absolute text-2xl">{value}</span>
    </div>
  );
};

export default Square;
