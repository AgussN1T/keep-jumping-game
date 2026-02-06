export function checkControls({ jugador, keys }) {

    const isJugadorTouchingFloor = jugador.body.blocked.down
    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown


    if (isLeftKeyDown) {
        isJugadorTouchingFloor && jugador.anims.play('jugador-walk', true)
        jugador.x -= 2
        jugador.flipX = true
    } else if (isRightKeyDown) {
        isJugadorTouchingFloor && jugador.anims.play('jugador-walk', true)
        jugador.x += 2
        jugador.flipX = false
    } else if (isJugadorTouchingFloor) {
        jugador.anims.stop()
        jugador.anims.play('jugador-idle', true)
    }
    if (isUpKeyDown && isJugadorTouchingFloor) {
        jugador.setVelocityY(-200)
        jugador.anims.play('jugador-jump', true)
    }
    else {
        if (!jugador.body.blocked.down && jugador.body.velocity.y > 0) {
            jugador.setFrame(5);
        }
    }


}