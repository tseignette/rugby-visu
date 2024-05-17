import { Field } from "./Field";

interface WebSocketData {
  id: string;
  createdAt: Date;
}

const field = new Field();

const server = Bun.serve<WebSocketData>({
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(Bun.file("front/index.html"));
    }
    if (url.pathname === "/socket") {
      const now = new Date();
      const isUpgraded = server.upgrade<WebSocketData>(req, {
        data: {
          id: now.getTime().toString(),
          createdAt: now,
        },
      });

      if (isUpgraded) {
        return;
      }

      return new Response("Upgrade failed", { status: 500 });
    }

    return new Response(Bun.file(`front/${url.pathname}`));
  },
  websocket: {
    open(ws) {
      console.log(`Bonjour joueur ${ws.data.id} !`);

      const player = field.addPlayer(ws.data.id);

      ws.subscribe("terrain");
      ws.publish(
        "terrain",
        JSON.stringify({
          type: "enter",
          player,
        })
      );
      ws.send(
        JSON.stringify({
          type: "welcome",
          field: field.snapshot(),
          player,
        })
      );
    },
    message(ws, message) {
      const action = JSON.parse(String(message));

      switch (action.type) {
        case "move":
          console.log(`${ws.data.id} a bougé vers : ${action.direction}`);

          server.publish(
            "terrain",
            JSON.stringify({
              type: "move",
              id: ws.data.id,
              position: field.move(ws.data.id, action.direction),
            })
          );
          break;

        default:
          console.log(`${ws.data.id} a effectué une action invalide`);
          break;
      }
    },
    close(ws) {
      console.log(`Au revoir joueur ${ws.data.id} !`);

      field.removePlayer(ws.data.id);
      ws.unsubscribe("terrain");
      server.publish(
        "terrain",
        JSON.stringify({
          type: "exit",
          id: ws.data.id,
        })
      );
    },
  },
});

console.log(`J'écoute sur l'adresse ${server.hostname}:${server.port}...`);
