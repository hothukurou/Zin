
export class Explosion extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, destroyTimeMs: number) {
        super(scene, x, y);
        const explosion = scene.add.sprite(0, 0, "explosion");
        explosion.setOrigin(0.5);
        this.add(explosion);
        explosion.scale = 5;
        const tween = scene.tweens.create({
            targets: explosion,
            duration: destroyTimeMs,
            ease: Phaser.Math.Easing.Quartic.In,
            props: {

            },
            loop: false,
            onComplete: () => {
                explosion.destroy();
            }
        });
        const anim = scene.anims.create({
            key: 'animsKey',
            frames: scene.anims.generateFrameNumbers("explosion", { start: 0, end: 5 }),
            frameRate: 30,
            repeat: 10,
        });
        explosion.anims.play("animsKey");
        tween.play();
    }
}