import { useState, useEffect } from "react";

type CounterProps = {
  isYourTurn: boolean;
  setIsYourTurn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Counter = ({ isYourTurn, setIsYourTurn }: CounterProps) => {
  const [count, setCount] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      setCount(20);
      setIsYourTurn((prev) => !prev);
    }

    return () => clearInterval(timer);
  }, [count, setIsYourTurn]);

  useEffect(() => {
    setCount(20);
  }, [isYourTurn]);

  return (
    <div>
      <h1>{count}</h1>
    </div>
  );
};

export default Counter;
