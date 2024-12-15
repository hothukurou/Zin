
export class LeftBarObject extends Phaser.GameObjects.Container {
    private max: number;
    private value: number;
    private backRect: Phaser.GameObjects.Graphics;
    private frontRect: Phaser.GameObjects.Graphics;
    constructor(scene: Phaser.Scene, max: number, config: { backColor?: number, frontColor?: number, height?: number, width?: number }) {

        // configの値が存在しない時に与えられるデフォルト値をnull合体演算子で代入
        config.backColor = config.backColor ?? 0x333333;
        config.frontColor = config.frontColor ?? 0x339933;
        config.height = config.height ?? 10;
        config.width = config.width ?? 100;
        super(scene);
        this.max = max;
        this.value = max;
        this.backRect = scene.add.graphics();
        this.backRect.fillStyle(config.backColor, 1);
        this.backRect.fillRect(0, 0, config.width, config.height);
        this.add(this.backRect);

        this.frontRect = scene.add.graphics();
        this.frontRect.fillStyle(config.frontColor, 1);
        this.frontRect.fillRect(0, 0, config.width, config.height);
        this.add(this.frontRect);
        scene.add.existing(this);

    }
    // バーの値を更新する 第二引数を入れるとmax値も更新される
    update(value: number, max?: number) {
        if (max) this.max = max;
        this.frontRect.scaleX = value / this.max;
        this.value = value;
    }
    // 現在のバーの値を返す
    getValue() {
        return this.value;
    }
    // 現在のバーの最大値を返す
    getMaxValue() {
        return this.max;
    }

}