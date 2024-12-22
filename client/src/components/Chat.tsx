import { Input } from "./ui/input";

const Chat = () => {
  return (
    <div className="w-full flex-1 flex justify-center">
      <div className="h-full relative p-2 border rounded-xl w-[75%]">
        <Input className="w-[80%] absolute bottom-2" type="text" />
      </div>
    </div>
  );
};

export default Chat;
