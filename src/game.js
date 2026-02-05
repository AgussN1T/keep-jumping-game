import Phaser from 'phaser'

import { createAnimations } from './animations.js';
import { checkControls } from './checkcontrols.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {

        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.image('plataforma2', 'assets/plataforma2.png');

        this.load.spritesheet(
            'jugador', 'assets/jugador.png',
            { frameWidth: 32, frameHeight: 32 }
        )
    }

    create() {

        


        this.time.addEvent({
            delay: 1200,
            callback: this.spawnPlataforma,
            callbackScope: this,
            loop: true
        });


        this.jugador = this.physics.add.sprite(180, 550, 'jugador').setOrigin(0, 1).setCollideWorldBounds(true)
            .setGravityY(300).setSize(12, 16).setOffset(11, 16)


        this.plataformas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

/*         this.physics.world.createDebugGraphic();

        this.jugador.body.debugShowBody = true;
        this.jugador.body.debugBodyColor = 0xff0000; */


        this.plataforma = this.physics.add.staticSprite(180, 560, 'plataforma2')

        this.physics.add.collider(this.jugador, this.plataforma)

        this.physics.add.collider(this.jugador, this.plataformas)

        createAnimations(this)

        this.keys = this.input.keyboard.createCursorKeys()

        this.jugador.anims.play('jugador-idle', true)

        this.jugador.body.checkCollision.up = false;
        this.jugador.body.checkCollision.left = false;
        this.jugador.body.checkCollision.right = false;

    }

    update() {


        checkControls(this)

        this.plataformas.children.iterate(plataforma => {
            if (plataforma && plataforma.y > this.scale.height + 50) {
                plataforma.destroy();
            }
        });


    }

    spawnPlataforma() {

        const x = Phaser.Math.Between(40, this.scale.width - 40);
        const y = -20;
        const velocidad = Phaser.Math.Between(30, 60);

        const plataforma = this.plataformas.create(x, y, 'plataforma');

        plataforma
            .setVelocityY(velocidad)
            .setOrigin(0.5, 0.5);

    }


}

// width: 480,
// height: 800


const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 600,
    backgroundColor: '#44afd6',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [GameScene]
}

new Phaser.Game(config);