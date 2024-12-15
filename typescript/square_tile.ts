export class SquareTile extends Phaser.GameObjects.Rectangle {
    constructor(scene: Phaser.Scene, size: number = 60) {
        super(scene, 0, 0, size, size, 0x000000); // 背景色を黒（またはお好みの色）に設定
        this.setStrokeStyle(2, 0xffffff); // 枠線の太さと色を設定（白色）
        scene.add.existing(this);
    }
}