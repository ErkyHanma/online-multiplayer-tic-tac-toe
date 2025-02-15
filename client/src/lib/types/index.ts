export type playerProps = {
  name: string;
  id: string;
  isPlayerX
  : boolean;
};

export type playersProps = {
  enemy: {
    name: string;
    id: string;
    isPlayerX
    : boolean;
  };
  you: {
    name: string;
    id: string;
    isPlayerX
    : boolean;
  };
};

export type OnlineBoardProps = {
  playersData: playersProps ;
};

export type boardUpdated = {
  newBoard: string[];
  nextPlayer: playerProps;
  winner: string | undefined;
};
