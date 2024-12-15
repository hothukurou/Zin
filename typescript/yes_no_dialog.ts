import { Color } from "./color";
import { Button } from "./common_ui/button";

export class YesNoDialog extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, text: string, yesCallback: () => void, noCallback: () => void) {
        super(scene, 0, 0); // 背景色を黒（またはお好みの色）に設定
        scene.add.existing(this);

        const backgroundColor = Color.blue;
        const square = scene.add.rectangle(0, 0, 400, 200, backgroundColor);
        square.setOrigin(0, 0);
        square.alpha = 0.7;
        this.add(square);
        const label = scene.add.text(100, 30, text);
        label.setFontSize(30);
        this.add(label);

        const yesButton = new Button(scene, {
            width: 80,
            buttonColor: Color.red,
            text: "はい",
            textColor: Color.white,
            onClick: yesCallback
        });
        yesButton.x = 50;
        yesButton.y = 100;
        this.add(yesButton);

        const noButton = new Button(scene, {
            width: 80,
            buttonColor: Color.blue,
            text: "いいえ",
            textColor: Color.white,
            onClick: noCallback
        });
        noButton.x = 250;
        noButton.y = 100;
        this.add(noButton);




    }
}