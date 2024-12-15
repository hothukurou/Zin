
import { GameObjects, Scale } from "phaser";

export class TypewriterObject extends Phaser.GameObjects.Container {
    private textObjList: Phaser.GameObjects.Text[] = []; //1文を入れるテキストオブジェクト
    private textList: string[] = [];  // 代入するテキストリスト
    private isActive = false; // 現在稼働中か
    private containerHeight: number;
    private textWidth: number;
    private fontSize: number;
    private scrawlingTime: number;

    constructor(scene: Phaser.Scene, containerHeight: number, textWidth: number, fontSize: number, scrawlingTime: number) {
        super(scene);
        scene.add.existing(this);
        this.containerHeight = containerHeight;
        this.textWidth = textWidth;
        this.fontSize = fontSize;
        this.scrawlingTime = scrawlingTime;
    }

    // テキストを追加する
    addText(text: string) {
        this.textList.push(text);
        if (!this.isActive) { // まだテキストが動き出していないならば動かし始める
            this.isActive = true;
            this.startCrawling();
        }
    }

    private upOneLineTextObj() {
        for (const textObj of this.textObjList) {
            textObj.y -= this.fontSize;
        }
        // yが0未満の座標のテキストは削除
        for (const textObj of this.textObjList) {
            if (textObj.y < 0) {
                textObj.destroy(false);
            }
        }
        // filterで配列を再生成する
        this.textObjList = this.textObjList.filter((textObj => textObj.y >= 0));
    }

    // 1文のスクロールを開始するプライベート関数
    private startCrawling() {
        // 直前のテキストオブジェクトがあれば、そのテキストの長さ分テキストを上に繰り上げる
        this.upOneLineTextObj();

        const crawlingText = this.textList[0];
        const textObj = this.scene.add.text(0, this.containerHeight - this.fontSize, "   ", {
            fontSize: `${this.fontSize}px`,
            color: "#ffffff",
            wordWrap: {
                width: this.textWidth,
                useAdvancedWrap: true
            }
        });

        this.textObjList.push(textObj);
        this.add(textObj);
        let count = 0;
        let brCount = 0;

        // 毎フレームごとにテキストを移動させる関数
        const timeoutCallback = () => {
            count++; // 1文章の表示カウント
            brCount++; // 改行文字数計算用カウント
            if (count > crawlingText.length) {
                clearInterval(timerId); // 繰り返しタイマを解除
                this.textList.shift(); // テキストリストの先頭を削除
                if (this.textList.length > 0) { // テキストリストが空でないならば、次のテキストリストを読み込ませる
                    this.startCrawling();
                } else {
                    this.isActive = false;
                }
                return;
            }
            textObj.text = crawlingText.substring(0, Math.floor(count));  // 文字列のうち、countの値までの文字列を表示する

            // もし改行されたら、テキストオブジェクトを全てフォントサイズ分改行する
            if (brCount * this.fontSize > this.textWidth) {
                brCount = 1;
                this.upOneLineTextObj();
            }
        }
        const timerId = setInterval(timeoutCallback, this.scrawlingTime); // 100msごとに1文字表示
    }

}

