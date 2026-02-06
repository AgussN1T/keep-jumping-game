export const createAnimations = (game) => {


    game.anims.create({
        key: 'jugador-walk',
        frames: [{ key: 'jugador', frame: 0 },
        { key: 'jugador', frame: 2 },
        { key: 'jugador', frame: 0 },
        { key: 'jugador', frame: 3 },
        ],
        frameRate: 10,
        repeat: -1
    })

    game.anims.create(
        {
            key: 'jugador-idle',
            frames: [{ key: 'jugador', frame: 0 },
            { key: 'jugador', frame: 1 },
            ],
            frameRate: 2,
            repeat: -1
        }
    )

    game.anims.create(
        {
            key: 'jugador-jump',
            frames: [{ key: 'jugador', frame: 4 }
            ],
            // frameRate: 1,
            repeat: 0
        }

    )

}