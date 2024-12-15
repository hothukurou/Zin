import { AllPlayerData, Point2d, RectPoint } from "./types";
import { basePath, loadImages, mapHeight, mapWidth, tileSize } from "./general";
import { YesNoDialog } from "./yes_no_dialog";
import { Button } from "./common_ui/button";
import { Color, numberToColorString } from "./color";
import { RectObj } from "./common_ui/rect";
import { fillPolygonInContainer } from "./common_ui/poligon";
import { countColorsInContainer } from "./common_ui/calc_show_color";
import { isPointInQuadrilateral } from "./common_ui/check_in_rect";
import { sortRectPoints } from "./common_ui/sort_rect";



export class MainScene extends Phaser.Scene {
    private updataCallback: () => void;

    constructor() {
        super({
            key: 'MainScene'
        });
    }

    preload(): void {
        const imagePathes = Object.keys(loadImages);
        for (const imagePath of imagePathes) {
            this.load.image(loadImages[imagePath], "./" + basePath + "/" + loadImages[imagePath]);
        }
    }

    create(): void {

        // ゲーム開始
        // 背景レイヤー(背景　陣地の白マスを含む)
        const backContainer = this.add.container(0, 0); // 初期位置 (0,0)
        // 陣地表示レイヤー(現在陣地を表示する)
        const zinContainer = this.add.container(0, 0); // 初期位置 (0,0)

        // 陣に表示するGraphics
        const zinGraphics = this.add.graphics();
        zinContainer.add(zinGraphics);

        // メインレイヤー(現在投げている石を表示する)
        const mainContainer = this.add.container(0, 0); // 初期位置 (0,0)
        // UIレイヤー(ボタンや、タイミングゲージなどを表示する)
        const uiContainer = this.add.container(0, 0); // 初期位置 (0,0)

        // 初期設定を行う
        // 白の初期陣地の生成
        const rect = new RectObj(
            { scene: this, width: 900, height: 500, lineColor: Color.white, lineWidth: 4 });
        rect.x = 50;
        rect.y = 50;

        // パラメータをリセットする
        const allPlayerData: AllPlayerData = [];
        allPlayerData.push({ rectPoints: [] });
        allPlayerData.push({ rectPoints: [] });
        allPlayerData.push({ rectPoints: [] });
        allPlayerData.push({ rectPoints: [] });
        // 4人分のパラメータ追加
        allPlayerData[0].rectPoints.push([{ x: 50, y: 50 }, { x: 50, y: 150 }, { x: 150, y: 150 }, { x: 150, y: 50 }]);
        allPlayerData[1].rectPoints.push([{ x: 850, y: 450 }, { x: 850, y: 550 }, { x: 950, y: 550 }, { x: 950, y: 450 }]);
        allPlayerData[2].rectPoints.push([{ x: 50, y: 550 }, { x: 50, y: 450 }, { x: 150, y: 450 }, { x: 150, y: 550 }]);
        allPlayerData[3].rectPoints.push([{ x: 950, y: 50 }, { x: 850, y: 50 }, { x: 850, y: 150 }, { x: 950, y: 150 }]);

        // 一例
        //allPlayerData[0].rectPoints.push([{ x: 55, y: 55 }, { x: 300, y: 300 }, { x: 200, y: 150 }, { x: 90, y: 50 }]);


        const playerColors = [Color.red, Color.blue, Color.yellow, Color.green];


        // 現在の陣地を描画する
        const showZin = (allPlayerData: AllPlayerData) => {
            zinGraphics.clear();
            for (let i = 0; i < allPlayerData.length; i++) {
                const playerData = allPlayerData[i];
                // 陣地の塗りつぶし
                for (const rectPoint of playerData.rectPoints) {
                    fillPolygonInContainer(zinGraphics, rectPoint, playerColors[i], 1);
                }
            }
        }
        showZin(allPlayerData);


        // 強さベクトルの表示
        // スプライトを画面中央に表示
        const vectorObj = this.add.sprite(0, 0, loadImages.vector);
        vectorObj.x = -999;
        vectorObj.setOrigin(0, 0.5);

        // 石の作成
        const stoneObjs: Phaser.GameObjects.Graphics[] = [];

        const createStone = (nowPlayer: number, alpha: number) => {
            // objの位置と半径からPhaser.Geom.Circleを作成
            const circle = new Phaser.Geom.Circle(0, 0, 10);

            // 白い境界線を描画
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff, 1); // 線の太さ、色、不透明度を設定
            graphics.fillStyle(playerColors[nowPlayer], alpha);
            graphics.fillCircleShape(circle); // Geom.Circleを渡して境界線を描画
            graphics.strokeCircleShape(circle); // Geom.Circleを渡して境界線を描画
            stoneObjs.push(graphics);
            return graphics;
        }

        // 全ての石を消す
        const clearStones = () => {
            while (stoneObjs.length > 0) {
                const obj = stoneObjs.pop();
                obj.destroy(true);
            }
        }



        // 現在のスコア
        // テキストを画面中央に表示
        const scoreLabels: Phaser.GameObjects.Text[] = [];
        {
            let nx = 100;
            for (const color of playerColors) {
                const scoreLabel = this.add.text(400, 300, 'Hello, Phaser!', {
                    fontSize: '32px',        // フォントサイズ
                    fontFamily: 'Arial',     // フォントファミリー
                    color: numberToColorString(color)        // 文字色（16進数表記）
                });
                scoreLabel.y = 10;
                scoreLabel.x = nx;
                nx += 100;
                scoreLabels.push(scoreLabel);
            }
        }
        const setScoreLabel = () => {
            // 色の数を数える例
            const numbers = countColorsInContainer(this, zinGraphics, playerColors);
            for (let i = 0; i < scoreLabels.length; i++) {
                scoreLabels[i].text = `${numbers[i]}`;
            }
        }
        setScoreLabel();



        // 投げる石
        let throwStone: Phaser.GameObjects.Graphics;



        // 状態
        let state: "settingStone" | "targetPoint" | "aiming" | "power" | "move" | "end" = "settingStone";
        let turn = 1;
        let throwCount = 0; // 投げた回数
        let nowPlayer = 0; // これから動かすプレイヤー
        let count = 0;

        // 現在いる座標
        let nowPoint: Point2d = { x: 0, y: 0 };
        // 目標の座標
        let targetPoint: Point2d = { x: 0, y: 0 };
        // 投げる矢印の角度
        let vectorRad = 0;
        // 投げる強さ
        let vectorPower = 0;
        // 決定時間
        let adjustTime = 0;

        // 石の速度データ
        let stoneVx = 0;
        let stoneVy = 0;

        // 投げた四角形の情報
        let throwRect: RectPoint = [];

        // 画面全体にクリックイベントを設定
        this.input.on('pointerdown', function (pointer) {
            // クリックされた位置の座標を取得

            switch (state) {
                case "settingStone": {
                    // 指定した位置が自分の陣地か調べる
                    if (!isPointInQuadrilateral(allPlayerData[nowPlayer], pointer)) {
                        return;
                    }
                    // 投げた回数を初期化
                    throwCount = 0;
                    // 石を設置
                    const obj = createStone(nowPlayer, 1);
                    obj.x = pointer.x;
                    obj.y = pointer.y;
                    nowPoint.x = pointer.x;
                    nowPoint.y = pointer.y;

                    // 四角形の頂点を追加
                    throwRect.push({ x: obj.x, y: obj.y });
                    // 状態を次に変える
                    state = "targetPoint";
                    break;
                }
                case "targetPoint": {
                    targetPoint.x = pointer.x;
                    targetPoint.y = pointer.y;

                    state = "aiming";
                    break;
                }
                case "aiming": {
                    // 投げる方向が決まってので、次は強さ調整に入る
                    state = "power";
                    break;
                }
                case "power": {
                    // 強さを決定したので実際に石が動く
                    state = "move";
                    count = 0;
                    break;
                }
            }


        }, this);

        // ターンを切り替える
        const changeTurn = () => {
            // ターンを変える
            nowPlayer = (nowPlayer + 1) % allPlayerData.length;
            clearStones();
            showZin(allPlayerData);
            state = "settingStone";
            setScoreLabel();
            throwRect = [];
        }

        // updateイベント内で使うためにわざわざprivate変数にするのも面倒なので、
        // create関数内でupdate関数処理が行えるようにする
        ////関数の実体を都合に良い場所で書ける。
        this.updataCallback = () => {
            switch (state) {
                case "aiming": {
                    // 目標地点をもとに角度を計算
                    const targetRad = Math.atan2(targetPoint.y - nowPoint.y, targetPoint.x - nowPoint.x);
                    // 矢印ベクトルを表示させる
                    vectorObj.x = nowPoint.x;
                    vectorObj.y = nowPoint.y;
                    vectorRad = targetRad + Math.sin(adjustTime) * 0.3;
                    vectorObj.rotation = targetRad + Math.sin(adjustTime) * 0.3;

                    adjustTime += 0.1;
                    break;
                }
                case "power": {
                    // 矢印ベクトルの強さを変える
                    vectorPower = 1.5 - Math.abs(Math.sin(adjustTime)) * 1.2;
                    vectorObj.scaleX = vectorPower;
                    adjustTime += 0.025;
                    break;
                }
                case "move": {
                    count++;
                    if (count === 1) {
                        vectorObj.x = -999;
                        throwStone = createStone(nowPlayer, 1);
                        throwStone.x = nowPoint.x;
                        throwStone.y = nowPoint.y;
                        stoneVx = Math.cos(vectorRad) * vectorPower * 10;
                        stoneVy = Math.sin(vectorRad) * vectorPower * 10;
                    }
                    // 石を動かす
                    throwStone.x += stoneVx;
                    throwStone.y += stoneVy;
                    stoneVx *= 0.95;
                    stoneVy *= 0.95;
                    // 石が停止したらその地点を移動先とする
                    const power = stoneVx ** 2 + stoneVy ** 2;
                    if (power <= 0.01) {
                        // 投げた回数を加算
                        throwCount++;
                        // 四角形の頂点を追加
                        throwRect.push({ x: throwStone.x, y: throwStone.y });

                        // 範囲外ならば強制終了
                        if (throwStone.x < 50 || throwStone.x > 950 || throwStone.y < 50 || throwStone.y > 550) {
                            changeTurn();
                            return;
                        }
                        //　もし投げた回数が2以下であれば、どこにも領地が入っていないことが条件となる
                        if (throwCount <= 2) {
                            for (const playerData of allPlayerData) {
                                if (isPointInQuadrilateral(playerData, throwStone)) {
                                    changeTurn();
                                    return;
                                }
                            }
                        } else {
                            // もし3投目であれば、自分の陣地に入っていた場合には四角形を描くことができる
                            if (isPointInQuadrilateral(allPlayerData[nowPlayer], throwStone)) {
                                throwRect = sortRectPoints(throwRect);
                                allPlayerData[nowPlayer].rectPoints.push(throwRect);
                                changeTurn();
                                return;
                            } else {
                                changeTurn();
                                return;
                            }

                        }

                        state = "targetPoint";
                        nowPoint.x = throwStone.x;
                        nowPoint.y = throwStone.y;


                    }
                }
            }

        }
    }
    update(): void {//delta
        // create関数内で以下関数の中身は定義しておく,変数はthis必要なし
        this.updataCallback();//deltaで引き継いでいく


    }
}