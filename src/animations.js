export const createAnimations = (game) => {

    game.anims.create(
        {
            key: 'jugador-idle',
            frames: [{ key: 'jugador', frame: 0 },
            { key: 'jugador', frame: 1 },
            { key: 'jugador', frame: 2 },
            { key: 'jugador', frame: 1 },
            ],
        frameRate: 4,
        repeat: -1
        }

    )
}