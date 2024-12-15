import * as Phaser from 'phaser';

export type ButtonConfig= {
    width: number;
    buttonColor: number;
    text: string;
    textColor: number;
    onClick: () => void;
}

export class Button extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, config: ButtonConfig) {
        super(scene);

        // ボタンの背景を作成
        const button = new Phaser.GameObjects.Graphics(scene);
        button.fillStyle(darkenColor(config.buttonColor, 0.2), 1);
        button.fillRoundedRect(-5, -5, config.width, 50, 12);
        button.fillStyle(config.buttonColor, 1);
        button.fillRoundedRect(0, 0, config.width, 50, 12);

        // ボタンのテキストを作成
        const buttonText = new Phaser.GameObjects.Text(scene, config.width / 2, 25, config.text, {
            color: "#" + config.textColor.toString(16),
            align: 'center',
            fontSize: '24px'
        });
        buttonText.setOrigin(0.5, 0.5);

        this.add(button);
        this.add(buttonText);

        // クリックイベントを設定
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, config.width, 50), Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', config.onClick);

        scene.add.existing(this);
    }
}

const darkenColor = (color: number, factor: number): number => {
    const r = (color >> 16) & 0xFF;
    const g = (color >> 8) & 0xFF;
    const b = color & 0xFF;

    const darkR = Math.max(0, Math.min(255, Math.floor(r * factor)));
    const darkG = Math.max(0, Math.min(255, Math.floor(g * factor)));
    const darkB = Math.max(0, Math.min(255, Math.floor(b * factor)));

    return (darkR << 16) | (darkG << 8) | darkB;
}