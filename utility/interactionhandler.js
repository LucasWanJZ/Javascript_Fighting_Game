// game end handler
function checkHealthBar(timerId) {
  clearTimeout(timerId);
  if (player.health == enemy.health) {
    document.querySelector("#game_end_ui").innerHTML = "It's a draw!";
  } else if (player.health > enemy.health) {
    document.querySelector("#game_end_ui").innerHTML = "Player 1 Wins!";
  } else {
    document.querySelector("#game_end_ui").innerHTML = "Player 2 Wins!";
  }
  document.querySelector("#game_end_ui").style.display = "flex";
}

// attack handler
function handleAttack(player, enemy) {
  const playerHitsEnemy = attackCollision({ sprite1: player, sprite2: enemy });
  const enemyHitsPlayer = attackCollision({ sprite1: enemy, sprite2: player });

  if (playerHitsEnemy) {
    enemy.staggered();
    if (player.direction === direction.RIGHT) {
      enemy.position.x += 20;
    }
    if (player.direction === direction.LEFT) {
      enemy.position.x -= 20;
    }

    player.isAttacking1 = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    console.log("player hit");
  }
  if (enemyHitsPlayer) {
    player.staggered();
    if (enemy.direction === direction.RIGHT) {
      player.position.x += 20;
    }
    if (enemy.direction === direction.LEFT) {
      player.position.x -= 20;
    }

    enemy.isAttacking1 = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("enemy hit");
  }
}

// movement handler
function updateFighterMovement(fighter1, fighter2) {
  // fighter1 movement
  fighter1.velocity.x = 0;
  if (!fighter1.isStaggered && !fighter1.recovering) {
    if (!spriteCollision({ sprite1: fighter1, sprite2: fighter2 })) {
      if (keys.a.pressed && fighter1.lastkey === "a") {
        fighter1.velocity.x = -1;
      } else if (keys.d.pressed && player.lastkey === "d") {
        fighter1.velocity.x = 1;
      }

      if (keys.w.pressed && player.jumpcount < 2) {
        if (fighter1.touchGround) {
          fighter1.velocity.y -= 30;
        } else {
          fighter1.velocity.y = -20;
        }
      }
    } else {
      // collision between fighters
      if (fighter1.direction === direction.RIGHT) {
        if (fighter1.position.x < enemy.position.x) {
          fighter1.position.x -= 1;
          fighter2.position.x += 1;
        } else {
          fighter1.position.x += 1;
          fighter2.position.x -= 1;
        }
      } else if (fighter1.direction === direction.LEFT) {
        if (fighter1.position.x > enemy.position.x) {
          fighter1.position.x += 1;
          fighter2.position.x -= 1;
        } else {
          fighter1.position.x -= 1;
          fighter2.position.x += 1;
        }
      } else if (fighter1.velocity.y > 0) {
        fighter1.position.y -= 3;
      } else if (fighter2.velocity.y > 0) {
        fighter2.position.y -= 3;
      }
    }
  }

  // fighter2 movement
  fighter2.velocity.x = 0;
  if (!fighter2.isStaggered && !fighter2.recovering) {
    if (!spriteCollision({ sprite1: fighter1, sprite2: fighter2 })) {
      if (keys.ArrowLeft.pressed && fighter2.lastkey === "ArrowLeft") {
        fighter2.velocity.x = -1;
      } else if (keys.ArrowRight.pressed && fighter2.lastkey === "ArrowRight") {
        fighter2.velocity.x = 1;
      }

      if (keys.ArrowUp.pressed && enemy.jumpcount < 2) {
        if (fighter2.touchGround) {
          fighter2.velocity.y -= 30;
        } else {
          fighter2.velocity.y = -20;
        }
      }
    }
  }
}