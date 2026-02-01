import Phaser from 'phaser'

import { createAnimations } from './animations.js';

class GameScene extends Phaser.Scene {
    constructor() {
        super('game');
    }

/* 📏 Plataforma corta (difícil)

Ancho: 70–90 px

Alto: 12–16 px

👉 Es lo mínimo sin volverse injusto.

📏 Plataforma media (estándar)

Ancho: 110–140 px

Alto: 14–18 px

📏 Plataforma larga (fácil / descanso)

Ancho: 180–220 px

Alto: 16–20 px */

/* Personaje — tamaño recomendado
📐 Tamaño base

Ancho: 28–36 px

Alto: 40–48 px

Forma ideal:

cápsula

mini personaje estilizado

un poco más alto que ancho

👉 Esto hace que:

aterrizar se sienta preciso

el jugador “lea” bien colisiones */

    preload() {}

    create() {}

    update() {}
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