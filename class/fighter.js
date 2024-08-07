class Fighter extends Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      width: undefined,
      height: undefined,
      offset: { x: 0, y: 0 },
    },
    attackFrame,
    framesHold = 5,
    blockOffset = { x: 0, y: 0 },
  }) {
    super({
      position,
      imageSrc,
      scale,
      frames,
      offset,
    });

    // fighter properties
    this.health = 100;
    this.velocity = { x: 0, y: 0 };
    this.height = 150;
    this.width = 50;
    this.speed = 10;
    this.jumpcount = 0;
    this.wins = 0;

    // attack/block box properties
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: attackBox.width,
      height: attackBox.height,
      offset: attackBox.offset,
    };
    this.blockOffset = blockOffset;

    // fighter states
    this.attacking1 = false;
    this.attacking2 = false;
    this.stunned = false;
    this.blocking = false;
    this.blocked = false;
    this.dead = false;

    // fighter flags
    this.disableAttack1 = false;
    this.disableAttack2 = false;
    this.disableBlock = false;

    // fighter animations
    this.currentFrame = 0;
    this.framesHold = framesHold;
    this.sprites = sprites;
    this.attackFrame = attackFrame;
    this.attackFrame2 = 4;
    this.stunnedImage = new Image();
    this.stunnedImage.src = "./assets/ui/stunned.png";

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].src;
    }
  }

  draw() {
    // stunned animation
    if (this.stunned && this.health > 0) {
      c.drawImage(
        this.stunnedImage,
        this.position.x - 20,
        this.position.y - 20,
        50,
        50
      );
    }

    // sprite animation
    super.draw();

    // block barrier
    if (this.blocking) {
      c.beginPath();
      c.arc(
        this.position.x + this.width / 2 + this.blockOffset.x,
        this.position.y + this.height / 2 + this.blockOffset.y,
        70,
        0,
        Math.PI * 2
      );
      c.strokeStyle = "rgba(0, 255, 255, 0.8)";
      c.lineWidth = 4;
      c.shadowColor = "rgba(0, 255, 255, 0.8)";
      c.shadowBlur = 10;
      c.stroke();
      c.closePath();
    }

    // reset canvas brush settings
    c.strokeStyle = "#000000";
    c.shadowColor = "rgba(0, 0, 0, 0)";
    c.shadowBlur = 0;
  }

  animateFrame() {
    // if dead, death animation will not be overwritten
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.frames - 2) {
        this.dead = true;
        return;
      }
    }

    super.animateFrame();
  }

  reset() {
    // state reset
    this.health = 100;
    this.velocity = { x: 0, y: 0 };
    this.jumpcount = 0;
    this.switchSprite("idle");
    this.dead = false;

    // position reset
    if (this.attackBox.offset.x > 0) {
      gsap.to("#playerHealth", { width: this.health + "%", duration: 0.25 });
      this.position.x = originalPosition1.x;
      this.position.y = originalPosition1.y;
    } else {
      gsap.to("#enemyHealth", { width: this.health + "%", duration: 0.25 });
      this.position.x = originalPosition2.x;
      this.position.y = originalPosition2.y;
    }
  }

  // get game start locations
  static get originalPosition1() {
    return originalPosition1;
  }
  static get originalPosition2() {
    return originalPosition2;
  }

  update() {
    this.draw();
    if (!this.dead) {
      this.animateFrame();
    }

    // movemnt x axis
    const movement = this.velocity.x * this.speed;
    if (this.position.x + this.width + movement >= canvas.width) {
      this.velocity.x = 0;
    } else if (this.position.x + movement < 0) {
      this.velocity.x = 0;
    } else {
      this.position.x += movement;
    }

    // movement y axis
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
      this.jumpcount = 0;
    } else {
      this.velocity.y += gravity;
      this.position.y += this.velocity.y;
    }

    // attack box
    this.attackBox.position.y = this.position.y + 50;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
  }

  switchSprite(sprite) {
    // prevent switching sprite while dead
    if (
      this.image === this.sprites.death.image &&
      this.currentFrame < this.sprites.death.frames - 1 &&
      this.health <= 0
    ) {
      return;
    }

    if (sprite === "death") {
      this.image = this.sprites.death.image;
      this.frames = this.sprites.death.frames;
      this.currentFrame = 0;
    }

    // prevent switching sprite while getting hit
    if (
      this.image === this.sprites.hit.image &&
      this.currentFrame < this.sprites.hit.frames - 1
    ) {
      return;
    }

    if (sprite === "hit") {
      this.image = this.sprites.hit.image;
      this.frames = this.sprites.hit.frames;
      this.currentFrame = 0;
    }

    // prevent switching sprite while attacking
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.frames - 1
    ) {
      return;
    }

    if (
      this.image === this.sprites.attack2.image &&
      this.currentFrame < this.sprites.attack2.frames - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image != this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.frames = this.sprites.idle.frames;
          this.framesHold = this.sprites.idle.framesHold;
          this.currentFrame = 0;
        }
        break;
      case "run":
        var run_audio = document.querySelector("#run_sound");
        run_audio.play();
        if (this.image != this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.frames = this.sprites.run.frames;
          this.framesHold = this.sprites.run.framesHold;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        var jump_audio = document.querySelector("#jump_sound");
        jump_audio.volume = 0.3;
        jump_audio.play();
        if (this.image != this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.frames = this.sprites.jump.frames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image != this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.frames = this.sprites.fall.frames;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image != this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.frames = this.sprites.attack1.frames;
          this.framesHold = this.sprites.attack1.framesHold;
          this.currentFrame = 0;
        }
        break;
      case "attack2":
        if (this.image != this.sprites.attack2.image) {
          this.image = this.sprites.attack2.image;
          this.frames = this.sprites.attack2.frames;
          this.framesHold = this.sprites.attack2.framesHold;
          this.currentFrame = 0;
        }
        break;
    }
  }

  // Recovery time after attacking
  attackRecovery() {
    this.disableAttack1 = true;
    this.disableAttack2 = true;
    setTimeout(() => {
      this.disableAttack1 = false;
      this.disableAttack2 = false;
    }, 700);
  }

  attack1() {
    this.switchSprite("attack1");
    var attack = document.querySelector("#attack_sound");
    attack.volume = 0.8;
    attack.play();
    this.attacking1 = true;
    setTimeout(() => {
      this.attacking1 = false;
    }, 300);

    // attack recovery
    this.attackRecovery();
  }

  attack2() {
    this.switchSprite("attack2");
    var attack = document.querySelector("#attack2_sound");
    attack.volume = 0.25;

    // charge attack, if not interrupted, attack after 0.4s
    this.charging = true;
    const chargingTime = setTimeout(() => {
      if (!this.stunned) {
        attack.play();
        this.attacking2 = true;
        this.charging = false;
      }
    }, 400);
    setTimeout(() => {
      this.attacking2 = false;
    }, 800);

    // attack recovery
    this.attackRecovery();

    this.chargedTimeOut = chargingTime;
  }

  block() {
    var blockSound = document.querySelector("#block_sound");
    blockSound.volume = 0.2;
    blockSound.play();
    this.blocking = true;
    setTimeout(() => {
      this.blocking = false;
    }, 300);

    // block recovery
    this.disableBlock = true;
    setTimeout(() => {
      this.disableBlock = false;
    }, 800);
  }

  hit(damage, moveBack) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.switchSprite("death");
      gameEnd = true;
    } else {
      this.staggered();
    }

    if (this.attackBox.offset.x > 0) {
      gsap.to("#playerHealth", { width: this.health + "%", duration: 0.25 });
      this.position.x = Math.max(this.position.x - moveBack, 0);
    } else {
      gsap.to("#enemyHealth", { width: this.health + "%", duration: 0.25 });
      this.position.x = Math.min(
        this.position.x + moveBack,
        canvas.width - this.width
      );
    }
  }

  staggered() {
    this.stunned = true;
    this.switchSprite("hit");

    // charge attack interrupted
    if (this.charging) {
      clearTimeout(this.chargedTimeOut);
      this.charging = false;
      this.attacking2 = false;
    }

    setTimeout(() => {
      this.stunned = false;
    }, 500);
  }
}
