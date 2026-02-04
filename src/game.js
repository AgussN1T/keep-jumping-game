import Phaser from 'phaser'

import { createAnimations } from './animations.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }



    preload() {

        this.load.image('plataforma', 'assets/plataforma.png');
        
        this.load.spritesheet(
        'jugador', 'assets/jugador.png',
        { frameWidth: 32, frameHeight: 34 }
    )
    }

    create() {

        this.jugador = this.physics.add.sprite(50, 110, 'jugador').setOrigin(0, 1).setCollideWorldBounds(true).setGravityY(300)
        this.plataforma = this.physics.add.staticSprite(200, 300, 'plataforma')
        this.physics.add.collider(this.jugador, this.plataforma);

        createAnimations(this)
        
        this.keys = this.input.keyboard.createCursorKeys()
        
        this.jugador.anims.play('jugador-idle', true)

    }

    update() {

        
        

    }
}

const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    backgroundColor: '#44afd6',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 }
        }
    },
    scene: [GameScene]
}

new Phaser.Game(config);