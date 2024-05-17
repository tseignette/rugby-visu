const $field = document.querySelector("#field");
const controlButtons = document.querySelectorAll("#controls button");

for (const $controlButton of controlButtons) {
  $controlButton.addEventListener("click", ({ target }) => {
    window.webSocket.send(
      JSON.stringify({
        type: "move",
        direction: target.dataset.direction,
      })
    );
  });
}

window.enterField = function (field, me) {
  for (const player of field.players) {
    window.addPlayer(player);
  }
};

window.addPlayer = function (player) {
  const $player = document.createElement("article");

  $player.id = `player-${player.id}`;
  $player.style.backgroundColor = player.color;

  $field.appendChild($player);
  window.move(player.id, player.position);
};

window.removePlayer = function (id) {
  const $player = document.querySelector(`#player-${id}`);

  $player.remove();
};

window.move = function (id, position) {
  const $player = document.querySelector(`#player-${id}`);

  $player.style.left = `${position[0]}%`;
  $player.style.bottom = `${position[1]}%`;
};
