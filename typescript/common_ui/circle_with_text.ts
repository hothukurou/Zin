export default class CircleWithText extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, x: number, y: number, color: number, text: string, onClickCallback: () => void) {
        super(scene, x, y);

        // 円を描画するGraphicsオブジェクトを作成
        const circle = new Phaser.GameObjects.Graphics(scene);
        circle.lineStyle(10, 0xFFFFFF); // 枠の色と太さを指定
        circle.fillStyle(color); // 塗りつぶしの色を指定
        circle.fillCircle(0, 0, 320); // 半径100の円を描画
        circle.strokeCircle(0, 0, 320); // 円の枠を描画

        // テキストオブジェクトを作成
        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = { color: '#ffffff', align: 'center', fontSize: "320px" };
        const textObject = new Phaser.GameObjects.Text(scene, 0, 0, text, textStyle).setOrigin(0.5, 0.5);
        textObject.y = -380;

        // コンテナに円とテキストを追加
        this.add(circle);
        this.add(textObject);

        // コンテナをインタラクティブに設定
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 320), Phaser.Geom.Circle.Contains);

        // クリック（またはタップ）イベントリスナを追加
        this.on('pointerdown', onClickCallback);

        // シーンにこのコンテナを追加
        scene.add.existing(this);
    }
}
