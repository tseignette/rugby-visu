const webSocket = new WebSocket(`ws://${location.host}/socket`);

window.webSocket = webSocket;

webSocket.addEventListener("open", () => {
  console.log("Bonjour serveur !");
});

webSocket.addEventListener("message", ({ data }) => {
  const action = JSON.parse(data);

  console.log(action);

  switch (action.type) {
    case "welcome":
      console.log(`Bienvenue sur le terrain !`);

      window.enterField(action.field, action.player);
      break;

    case "enter":
      console.log(`${action.player.id} est entré sur le terrain`);

      window.addPlayer(action.player);
      break;

    case "exit":
      console.log(`${action.id} est sorti du terrain`);

      window.removePlayer(action.id);
      break;

    case "move":
      console.log(`${action.id} a bougé`);

      window.move(action.id, action.position);
      break;

    default:
      console.log("Serveur a effectué une action invalide");
      break;
  }
});
