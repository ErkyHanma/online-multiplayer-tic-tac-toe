import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GenerateRoomCode() {
  const values = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let roomCode = "";

  for (let i = 0; i < 7; i++) {
    roomCode += values[Math.floor(Math.random() * values.length)];
  }

  return roomCode;
}


// Board Utils: 
