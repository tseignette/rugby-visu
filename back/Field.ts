export interface Player {
  id: string;
  color: string;
  position: [number, number];
}

export enum Direction {
  Up = "up",
  Right = "right",
  Down = "down",
  Left = "left",
}

function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export class Field {
  players: Player[] = [];

  addPlayer(id: string) {
    const newPlayer = {
      id,
      color: generateRandomColor(),
      position: [50, 50] as [number, number],
    };

    this.players.push(newPlayer);

    return newPlayer;
  }

  removePlayer(id: string) {
    this.players = this.players.filter((player) => player.id !== id);
  }

  move(id: string, direction: Direction) {
    const { position } = this.players.find(
      (player) => player.id === id
    ) as Player;

    switch (direction) {
      case Direction.Up:
        if (position[1] < 100) {
          position[1] += 10;
        }
        break;

      case Direction.Right:
        if (position[0] < 100) {
          position[0] += 10;
        }
        break;

      case Direction.Down:
        if (position[1] > 0) {
          position[1] -= 10;
        }
        break;

      case Direction.Left:
        if (position[0] > 0) {
          position[0] -= 10;
        }
        break;
    }

    return position;
  }

  snapshot() {
    return {
      players: this.players,
    };
  }
}
