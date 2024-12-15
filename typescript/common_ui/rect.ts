export class RectObj extends Phaser.GameObjects.Container {
    constructor(
        params: {
            scene: Phaser.Scene,
            width: number,
            height: number,
            lineColor: number,
            lineWidth: number
        }
    ) {
        // 親クラスのコンストラクタを呼び出し、コンテナを初期化
        super(params.scene, 0, 0);

        // シーンにこのコンテナを追加
        params.scene.add.existing(this);

        // Graphicsオブジェクトを作成し、このコンテナに追加
        const graphics = params.scene.add.graphics();
        this.add(graphics);

        // 四角形を描画
        graphics.lineStyle(params.lineWidth, params.lineColor, 1); // 線のスタイルを設定
        graphics.strokeRect(0, 0, params.width, params.height); // 四角形を描画
    }
}