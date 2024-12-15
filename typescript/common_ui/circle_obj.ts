// 円を表示するクラス
export default class CircleObj extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, radius: number, color: number) {
        super(scene, 0, 0);

        // 円を描画するGraphicsオブジェクトを作成
        const circle = new Phaser.GameObjects.Graphics(scene);
        circle.lineStyle(5, 0xFFFFFF); // 枠の色と太さを指定
        circle.fillStyle(color); // 塗りつぶしの色を指定
        circle.fillCircle(0, 0, radius); // 半径100の円を描画
        circle.strokeCircle(0, 0, radius); // 円の枠を描画


        // コンテナに円とテキストを追加
        this.add(circle);

        // シーンにこのコンテナを追加
        scene.add.existing(this);
    }
}
