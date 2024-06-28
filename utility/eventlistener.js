window.addEventListener("keydown", (event) => {
  if (!player.death && !enemy.death && !gameEnd && !gameStart) {
    switch (event.key) {
      // player1 keys
      case "d":
        keys.d.pressed = true;
        player.lastkey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastkey = "a";
        break;
      case "w":
        keys.w.pressed = true;
        window.setTimeout(() => {
          keys.w.pressed = false;
        }, 500);
        if (player.jumpcount < 2) {
          player.jumpcount++;
        } else {
          keys.w.pressed = false;
        }
        break;
      case "r":
        player.attack1();
        break;
      // player 2 keys
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastkey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastkey = "ArrowRight";
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        window.setTimeout(() => {
          keys.ArrowUp.pressed = false;
        }, 500);
        if (enemy.jumpcount < 2) {
          enemy.jumpcount++;
        } else {
          keys.ArrowUp.pressed = false;
        }
        break;
      case "ArrowDown":
        enemy.attack1();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});

window.addEventListener("click", () => {
  if (Intro) {
    setTimeout(decreaseTimer, 1500);
    Intro = false;
    gameStart = true;
  }
});
