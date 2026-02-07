import Phaser from 'phaser'

import { createAnimations } from './animations.js';
import { checkControls } from './checkcontrols.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {

        this.load.image('plataformaAndamio', 'assets/plataforma.png');
        this.load.image('plataformaMadera', 'assets/plataforma2.png');
        this.load.image('plataformaOvni', 'assets/plataforma3.png');
        this.load.image('plataformaVaca', 'assets/plataforma4.png');

        this.load.image('plataformaInicial', 'assets/plataformaInicial.png');

        this.load.spritesheet(
            'jugador', 'assets/jugador.png',
            { frameWidth: 32, frameHeight: 32 }
        )
    }

    create() {

        this.time.addEvent({
            delay: 20000,
            callback: this.destroyPlataformaInicial,
            callbackScope: this,
        });


        this.time.addEvent({
            delay: 1500,
            loop: true,
            callback: () => this.spawnPlataforma('normal')
        });


        this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => this.spawnPlataforma('lateral')
        });

        this.time.addEvent({
            delay: 8000,
            loop: true,
            callback: () => this.spawnPlataforma('ovni')
        });

        this.time.addEvent({
            delay: 10000,
            loop: true,
            callback: () => this.spawnPlataforma('vaca')
        });



        this.jugador = this.physics.add.sprite(180, 450, 'jugador').setOrigin(0, 1).setCollideWorldBounds(true)
            .setGravityY(300).setSize(12, 16).setOffset(11, 16)

        this.plataformas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        /*         this.physics.world.createDebugGraphic();
        
                this.jugador.body.debugShowBody = true;
                this.jugador.body.debugBodyColor = 0xff0000; */

        this.plataformaInicial = this.physics.add.staticSprite(180, 460, 'plataformaInicial')

        this.physics.add.collider(this.jugador, this.plataformaInicial)

        this.physics.add.collider(this.jugador, this.plataformas,
            this.onPlayerLand,
            null,
            this)

        createAnimations(this)


        this.jugador.body.checkCollision.up = false;
        this.jugador.body.checkCollision.left = false;
        this.jugador.body.checkCollision.right = false;


        this.score = 0

        this.scoreText = this.add.text(
            this.scale.width / 2,
            20,
            '0',
            {
                fontFamily: 'Sans-serif',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setShadow(0, 1, '#000000', 4, false, true)


        this.isMobile = this.sys.game.device.input.touch


        // teclado (solo PC)
        if (!this.isMobile) {
            this.keys = this.input.keyboard.createCursorKeys()
        }

        // táctil (solo mobile)
        if (this.isMobile) {
            this.touch = {
                left: false,
                right: false,
                up: false
            }

            this.input.on('pointerdown', (pointer) => {
                if (pointer.x < this.scale.width / 2) {
                    this.touch.left = true
                } else {
                    this.touch.right = true
                }

                if (this.jugador.body.blocked.down) {
                    this.touch.up = true
                }
            })

            this.input.on('pointerup', () => {
                this.touch.left = false
                this.touch.right = false
                this.touch.up = false
            })
        }

    }

    update() {
        if (this.jugador.isDead) return;

        checkControls({
            jugador: this.jugador,
            keys: this.keys,
            touch: this.touch
        })

        this.plataformas.children.iterate(plataforma => {
            if (plataforma && plataforma.y > this.scale.height + 50) {
                plataforma.destroy();
            }
        });


        if (this.jugador.y >= config.height) {
            this.jugador.isDead = true
            // this.jugador.anims.play('jugador-lose')
            this.jugador.setCollideWorldBounds(false);
            setTimeout(() => {
                this.jugador.setVelocityY(-150)

            }, 100)

            setTimeout(() => {
                this.scene.restart()

            }, 2000)
        }

    }

    spawnPlataforma(tipo = 'normal') {
    const y = -20;

    // 1. Diccionario maestro de configuración
    const configPlataformas = {
        normal:  { textura: 'plataformaAndamio',  velMin: 4,  velMax: 16 },
        lateral: { textura: 'plataformaMadera', velMin: 2,  velMax: 6 },
        ovni:    { textura: 'plataformaOvni', velMin: 6, velMax: 10 },
        vaca:    { textura: 'plataformaVaca', velMin: 12,  velMax: 20 }
    };

    // Obtenemos la config del tipo, o por defecto la normal
    const config = configPlataformas[tipo] || configPlataformas.normal;
    
    // 2. Cálculo de velocidad usando el mapa
    const velocidad = Phaser.Math.Between(config.velMin, config.velMax) * 4;

    let x;
    if (tipo === 'lateral') {
        const frame = this.textures.get(config.textura).getSourceImage();
        const ancho = frame.width;
        const esIzquierda = Phaser.Math.Between(0, 1) === 0;
        x = esIzquierda ? ancho / 2 : this.scale.width - ancho / 2;
    } else {
        x = Phaser.Math.Between(40, this.scale.width - 40);
    }

    // 3. Creación
    const plataforma = this.plataformas.create(Math.round(x), y, config.textura);
    
    plataforma.scored = false;
    plataforma
        .setVelocityY(velocidad)
        .setOrigin(0.5, 1);
}

    destroyPlataformaInicial() {
        if (this.plataformaInicial) {
            this.plataformaInicial.destroy();
        }
    }

    onPlayerLand(jugador, plataforma) {

        if (!plataforma.scored && jugador.body.velocity.y >= 0) {
            plataforma.scored = true

            this.score += 1
            this.scoreText.setText(this.score)

            this.tweens.add({
                targets: this.scoreText,
                scale: 1.15,
                duration: 100,
                yoyo: true
            })
        }
    }



}



const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 600,
    pixelArt: true,
    render: {
        roundPixels: true
    },
    backgroundColor: '#3a9ec4',
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