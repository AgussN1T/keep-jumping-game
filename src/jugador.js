export default class Jugador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'jugador');


        this.scene = scene;
        this.COYOTE_TIME = 120;
        this.lastOnGround = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configuración física inicial
        this.setOrigin(0, 1)
            .setCollideWorldBounds(true)
            .setGravityY(300)
            .setSize(12, 16)
            .setOffset(11, 16);

        // Bloquear colisiones excepto por abajo
        this.body.checkCollision.up = false;
        this.body.checkCollision.left = false;
        this.body.checkCollision.right = false;

        this.isLose = false;
    }

    update(keys, touch) {
        if (this.isLose) return;

        const isTouchingFloor = this.body.blocked.down;

        if (isTouchingFloor) {
            this.lastOnGround = this.scene.time.now
        }

        const canJump =
            isTouchingFloor ||
            (this.scene.time.now - this.lastOnGround <= this.COYOTE_TIME)



        // Lógica de movimiento (Extraída de checkcontrols.js)
        const left = (keys?.left.isDown) || (touch?.left);
        const right = (keys?.right.isDown) || (touch?.right);
        const jump = (keys?.up.isDown) || (touch?.jump);

        if (left) {
            if (isTouchingFloor) this.play('jugador-walk', true);
            this.setVelocityX(-140); // Usamos velocity en lugar de x += 2 para físicas más suaves
            this.flipX = true;
        } else if (right) {
            if (isTouchingFloor) this.play('jugador-walk', true);
            this.setVelocityX(140);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
            if (isTouchingFloor) this.play('jugador-idle', true);
        }

        // Lógica de Salto
        if (jump && canJump) {
            this.setVelocityY(-200);
            this.play('jugador-jump', true);
            this.lastOnGround = 0;
            if (touch) touch.jump = false;
        }

        // Frame de caída (el que definimos antes)
        if (!isTouchingFloor && this.body.velocity.y > 0) {
            this.setFrame(5);
        }
    }

    lose() {
        this.isLose = true;
        this.setCollideWorldBounds(false);
        this.body.checkCollision.down = false;
        this.setVelocityY(-200); // Salto de muerte estilo Mario
    }
}