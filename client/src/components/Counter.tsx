import { useState, useEffect } from "react";

type CounterProps = {
  isYourTurn: boolean;
  setIsYourTurn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Counter = ({ isYourTurn, setIsYourTurn }: CounterProps) => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    if (count === 0) {
      setCount(10);
      setIsYourTurn((prev) => !prev);
    }

    return () => clearInterval(timer);
  }, [count, setIsYourTurn]);

  useEffect(() => {
    setCount(10);
  }, [isYourTurn]);

  return (
    <div>
      <h1>{count}</h1>
    </div>
  );
};

export default Counter;
