export function checkControls({ jugador, keys, touch }) {

    const isJugadorTouchingFloor = jugador.body.blocked.down

    const left =
        (keys && keys.left.isDown) ||
        (touch && touch.left)

    const right =
        (keys && keys.right.isDown) ||
        (touch && touch.right)

    const jump =
        (keys && keys.up.isDown) ||
        (touch && touch.up)

    if (left) {
        isJugadorTouchingFloor && jugador.anims.play('jugador-walk', true)
        jugador.x -= 2
        jugador.flipX = true
    }
    else if (right) {
        isJugadorTouchingFloor && jugador.anims.play('jugador-walk', true)
        jugador.x += 2
        jugador.flipX = false
    }
    else if (isJugadorTouchingFloor) {
        jugador.anims.play('jugador-idle', true)
    }

    if (jump && isJugadorTouchingFloor) {
        jugador.setVelocityY(-200)
        jugador.anims.play('jugador-jump', true)

        if (touch) touch.up = false
    }

    if (!isJugadorTouchingFloor && jugador.body.velocity.y > 0) {
        jugador.setFrame(5)
    }
}
