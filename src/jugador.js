export default class Jugador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'jugador');


        this.scene = scene;
        this.COYOTE_TIME = 120;
        this.lastOnGround = 0;
        this.cargas = 1;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0, 1)
            .setCollideWorldBounds(true)
            .setGravityY(300)
            .setSize(12, 16)
            .setOffset(11, 16);

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


        const left = (keys?.left.isDown) || (touch?.left);
        const right = (keys?.right.isDown) || (touch?.right);
        const jump = (keys?.up.isDown) || (touch?.jump);
        const down = (keys?.down.isDown) || (touch?.power);

        if (left) {
            if (isTouchingFloor) this.play('jugador-walk', true);
            this.setVelocityX(-120); 
            this.flipX = true;
        } else if (right) {
            if (isTouchingFloor) this.play('jugador-walk', true);
            this.setVelocityX(120);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
            if (isTouchingFloor) this.play('jugador-idle', true);
        }

        if (jump && canJump) {
            this.setVelocityY(-200);
            this.play('jugador-jump', true);
            this.lastOnGround = 0;
            if (touch) touch.jump = false;
        }

        if (!isTouchingFloor && this.body.velocity.y > 0) {
            this.setFrame(5);
        }

        if(down){
            if(this.cargas >= 1 && !isTouchingFloor){
                this.cargas --;
                this.scene.createTemporalPlatform(this.x,this.y);
                this.setVelocityY(-50);
                this.scene.updateTextCharges();
            }
        }
    }

    lose() {
        this.isLose = true;
        this.setCollideWorldBounds(false);
        this.body.checkCollision.down = false;
        this.setVelocityY(-200);
    }
}