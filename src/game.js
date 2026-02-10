import Phaser from 'phaser'

import { createAnimations } from './animations.js';
import Jugador from './jugador.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

    preload() {

        this.load.image('plataformaAndamio', 'assets/platforms/plataforma5.png');
        this.load.image('plataformaMadera', 'assets/platforms/plataforma2.png');
        this.load.image('plataformaOvni', 'assets/platforms/plataforma3.png');
        this.load.image('plataformaVaca', 'assets/platforms/plataforma4.png');
        this.load.image('plataformaInicial', 'assets/platforms/plataformaInicial.png');

        this.load.image('nube1', 'assets/background/nube1.png');
        this.load.image('nube2', 'assets/background/nube2.png');
        this.load.image('nube3', 'assets/background/nube3.png');
        this.load.image('background', 'assets/background/background.png');

        this.load.image('btnJump', 'assets/buttons/btnJump.png');

        this.load.spritesheet(
            'jugador', 'assets/entities/jugador.png',
            { frameWidth: 32, frameHeight: 32 }
        )
    }

    create() {

        this.add.image(0, 0, 'background').setOrigin(0, 0);

        const nubeFondo1 = this.add.image(140, 120, 'nube1');

        const nubeFondo2 = this.add.image(300, 190, 'nube2');

        const nubeFondo3 = this.add.image(70, 230, 'nube3');




        /* 
                this.tweens.add({
                    targets: [nubeFondo1, nubeFondo2],
                    x: '+=30',
                    duration: 20000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
        
                this.tweens.add({
                    targets: nubeFondo3,
                    x: '+=60',
                    duration: 12000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                }); */



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


        this.jugador = new Jugador(this, 180, 420);

        this.plataformas = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.plataformaInicial = this.physics.add.staticSprite(180, 430, 'plataformaInicial')

        this.physics.add.collider(this.jugador, this.plataformaInicial)

        this.physics.add.collider(this.jugador, this.plataformas,
            this.onPlayerLand,
            null,
            this)

        createAnimations(this)

        this.score = 0

        this.scoreText = this.add.text(
            this.scale.width / 2,
            20,
            '0',
            {
                fontFamily: 'Play',
                fontSize: '24px',
                color: '#ffffff'
            }
        ).setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setShadow(0, 1, '#000000', 4, false, true)


        this.isMobile = this.sys.game.device.input.touch

        //controles desktop
        if (!this.isMobile) {
            this.keys = this.input.keyboard.createCursorKeys()
        }

        //controles mobile
        if (this.isMobile) {

            this.touch = {
                left: false,
                right: false,
                jump: false
            }

            this.jumpButton = this.add.image(
                this.scale.width / 2,
                this.scale.height - 70,
                'btnJump'
            )
                .setScrollFactor(0)
                .setAlpha(0.6)
                .setInteractive()

            this.jumpButton.isUI = true;

            this.jumpButton.on('pointerdown', () => {
                this.touch.jump = true;
            })

            this.jumpButton.on('pointerup', () => {
                this.touch.jump = false;
            })

            this.jumpButton.setDepth(10);


            this.leftZone = this.add.zone(0, 0, this.scale.width / 2, this.scale.height)
                .setOrigin(0)
                .setInteractive()

            this.leftZone.on('pointerdown', () => {
                this.touch.left = true
            })
            this.leftZone.on('pointerup', () => {
                this.touch.left = false
            })

            this.rightZone = this.add.zone(this.scale.width / 2, 0, this.scale.width / 2, this.scale.height)
                .setOrigin(0)
                .setInteractive()

            this.rightZone.on('pointerdown', () => {
                this.touch.right = true
            })
            this.rightZone.on('pointerup', () => {
                this.touch.right = false
            })

            this.input.addPointer(2);
            /*  this.input.on('pointerdown', (pointer) => {
 
                 if (this.jumpButton.getBounds().contains(pointer.x, pointer.y)) {
                     return;
                 }
 
                 if (pointer.x < this.scale.width / 2) {
                     this.touch.left = true;
                 } else {
                     this.touch.right = true;
                 }
 
             })
 
             this.input.on('pointerup', () => {
                 this.touch.left = false;
                 this.touch.right = false;
                 this.touch.up = false;
             }) */
        }

        this.startTime = this.time.now;

    }

    update() {
        if (this.jugador.isLose) return;

        this.jugador.update(this.keys, this.touch);

        this.plataformas.children.iterate(plataforma => {
            if (plataforma && plataforma.y > this.scale.height + 50) {
                plataforma.destroy();
            }
        });

        if (this.jugador.y >= this.scale.height && !this.jugador.isLose) {
            this.triggerGameOver();
        }

    }
    showGameOverModal() {

        this.overlay = this.add.rectangle(
            0, 0,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.6
        )
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(100);

        // contenedor del modal
        this.gameOverContainer = this.add.container(
            this.scale.width / 2,
            this.scale.height / 2
        )
            .setScrollFactor(0)
            .setDepth(101);

        /* const panel = this.add.rectangle(0, 0, 260, 180, 0x1e1e1e, 0.95)
            .setStrokeStyle(2, 0xffffff); */

        const panel = this.add.graphics();

        panel.fillStyle(0x1e1e1e, 0.95);
        panel.lineStyle(2, 0xffffff, 1);
        panel.fillRoundedRect(-130, -90, 260, 180, 16);
        panel.strokeRoundedRect(-130, -90, 260, 180, 16);

        const title = this.add.text(0, -50, 'PERDISTE', {
            fontFamily: 'Play',
            fontSize: '26px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const scoreText = this.add.text(0, -15, `Puntaje: ${this.score}`, {
            fontFamily: 'Play',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const timeText = this.add.text(
            0,
            15,
            `Tiempo: ${this.finalTime}s`,
            {
                fontFamily: 'Play',
                fontSize: '18px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);


        /* const btn = this.add.rectangle(0, 55, 140, 40, 0x3a9ec4)
            .setInteractive(); */

        const btn = this.add.graphics();

        btn.fillStyle(0x3a9ec4, 1);
        btn.fillRoundedRect(-70, 35, 140, 40, 12);

        btn.setInteractive(
            new Phaser.Geom.Rectangle(-70, 35, 140, 40),
            Phaser.Geom.Rectangle.Contains
        );

        const btnText = this.add.text(0, 55, 'REINTENTAR', {
            fontFamily: 'Play',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);

        btn.on('pointerdown', () => {
            btn.setScale(0.95);
        });

        btn.on('pointerup', () => {
            btn.setScale(1);
            this.scene.restart();
        });

        btn.on('pointerdown', () => {
            this.scene.restart();
        });

        this.gameOverContainer.add([
            panel,
            title,
            scoreText,
            timeText,
            btn,
            btnText
        ]);

        // pequeña animación
        this.gameOverContainer.setScale(0.8);
        this.tweens.add({
            targets: this.gameOverContainer,
            scale: 1,
            duration: 200,
            ease: 'Back.easeOut'
        });
    }


    triggerGameOver() {
        this.jugador.lose();
        this.finalTime = Math.floor(
            (this.time.now - this.startTime) / 1000
        );

        this.time.delayedCall(1700, () => {
            this.cameras.main.shake(200, 0.02);
        });

        this.time.delayedCall(3000, () => {
            this.showGameOverModal();
        });
    }

    spawnPlataforma(tipo = 'normal') {
        const y = -20;

        const configPlataformas = {
            normal: { textura: 'plataformaAndamio', velMin: 4, velMax: 16 },
            lateral: { textura: 'plataformaMadera', velMin: 2, velMax: 6 },
            ovni: { textura: 'plataformaOvni', velMin: 6, velMax: 10 },
            vaca: { textura: 'plataformaVaca', velMin: 12, velMax: 20 }
        };


        const config = configPlataformas[tipo] || configPlataformas.normal;

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