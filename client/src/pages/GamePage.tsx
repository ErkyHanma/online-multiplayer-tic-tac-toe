import Board from "@/components/Board";
import Icon from "@/components/PageLogo";

const GamePage = () => {
  const name = localStorage.getItem("name");

  return (
    <div className="h-screen  gap-12 w-full flex flex-col items-center justify-center">
      <Icon />
      <div className="p-8 w-[1000px] items-center gap-6 bg-black min-h-[500px] rounded-lg flex flex-col ">
        <div className="w-full flex flex-col gap-1">
          <p>{name}</p>
          <div className="w-[100%] h-[4px] bg-gray-700"></div>
        </div>

        <div className="flex w-full justify-center ">
          <Board />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
