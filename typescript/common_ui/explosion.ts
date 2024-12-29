export class Explosion extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, path: string) {
        super(scene, x, y, path);
        scene.add.existing(this);


        this.setOrigin(0.5, 0.5);
        this.setDisplaySize(60, 60);

        // アニメーションの定義
        if (!scene.anims.exists('explode')) {
            scene.anims.create({
                key: 'explode',
                frames: scene.anims.generateFrameNumbers(path, { start: 0, end: 4 }),
                frameRate: 10,
                repeat: 0
            });
        }

        this.play('explode');

        this.on('animationcomplete', () => {
            this.destroy();
        });
    }
}
