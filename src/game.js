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
        this.load.image('plataforma3', 'assets/plataforma3.png');
        this.load.image('plataforma4', 'assets/plataforma4.png');

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
            delay: 5000,
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

        // this.keys = this.input.keyboard.createCursorKeys()

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
        let x;
        let textura = 'plataforma';

        const velocidad = Phaser.Math.Between(4, 16) * 4;

        if (tipo === 'normal') {

            x = Phaser.Math.Between(40, this.scale.width - 40);
            textura = 'plataforma';

        } else if (tipo === 'lateral') {

            const plataformaTemp = this.plataformas.create(0, 0, 'plataforma2');
            const ancho = plataformaTemp.displayWidth;
            plataformaTemp.destroy();

            const izquierda = Phaser.Math.Between(0, 1) === 0;

            x = izquierda
                ? ancho / 2
                : this.scale.width - ancho / 2;

            textura = 'plataforma2';
        } else if (tipo==='ovni'){

            x = Phaser.Math.Between(40, this.scale.width - 40);
            textura = 'plataforma3';   
        }
        else if (tipo==='vaca'){

            x = Phaser.Math.Between(40, this.scale.width - 40);
            textura = 'plataforma4';   
        }

        x = Math.round(x);

        const plataforma = this.plataformas.create(x, y, textura);
        plataforma.scored = false;

        plataforma
            .setVelocityY(velocidad)
            .setOrigin(0.5, 1);
    }



    /*     spawnPlataformaNormal() {
    
            const x = Math.round(
                Phaser.Math.Between(40, this.scale.width - 40)
            );
    
            const y = -20;
    
            const velocidad = Phaser.Math.Between(8, 16) * 4;
    
            const plataforma = this.plataformas.create(x, y, 'plataforma');
            plataforma.scored = false
    
            plataforma
                .setVelocityY(velocidad)
                .setOrigin(0.5, 1);
    
        }
    
        spawnPlataformaLateral(){
        
        const y = -20;
    
        // margen de seguridad
        const margen = 40;
        const anchoZona = 70;
    
    
        const izquierda = Phaser.Math.Between(0, 1) === 0;
    
        const x = izquierda
            ? Phaser.Math.Between(margen, margen + anchoZona)
            : Phaser.Math.Between(
                this.scale.width - margen - anchoZona,
                this.scale.width - margen
            );
    
        const velocidad = Phaser.Math.Between(8, 16) * 4;
    
        const plataforma = this.plataformas.create(
            Math.round(x),
            y,
            'plataforma2'
        );
    
        plataforma.scored = false;
    
        plataforma
            .setVelocityY(velocidad)
            .setOrigin(0.5, 1);
        } */

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

            // animación sutil (opcional)
            this.tweens.add({
                targets: this.scoreText,
                scale: 1.15,
                duration: 100,
                yoyo: true
            })
        }
    }



}

// width: 480,
// height: 800


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