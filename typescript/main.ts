import { AllPlayerData, Point2d, TrianglePoint } from "./types";
import { basePath, loadImages, mapHeight, mapWidth, tileSize } from "./general";
import { YesNoDialog } from "./yes_no_dialog";
import { Button } from "./common_ui/button";
import { Color, numberToColorString } from "./color";
import { RectObj } from "./common_ui/rect";
import { fillPolygonInContainer } from "./common_ui/poligon";
import { countColorsInContainer, getColorAtPoint } from "./common_ui/calc_show_color";
import { isPointInsidePolygon, isPointInTriangle } from "./common_ui/check_in_rect";
import { sortRectPoints } from "./common_ui/sort_rect";
import CircleObj from "./common_ui/circle_obj";
import { simulateThrowStones, strangth } from "./sim";
import { Explosion } from "./common_ui/explosion";


export class MainScene extends Phaser.Scene {
    private updataCallback: () => void;
    private mode: "0CPU" | "1CPU" | "2CPU" | "3CPU";
    constructor() {
        super({
            key: 'MainScene'
        });
    }

    init(data: any) {
        this.mode = data.mode;
    }

    preload(): void {
        const imagePathes = Object.keys(loadImages);
        for (const imagePath of imagePathes) {
            this.load.image(loadImages[imagePath], "./" + basePath + "/" + loadImages[imagePath]);
        }

        this.load.spritesheet("explosion", './images/explosion.png', { frameWidth: 60, frameHeight: 60 });


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
        allPlayerData.push({ trianglePoints: [], state: "setStone" });
        allPlayerData.push({ trianglePoints: [], state: "setStone" });
        allPlayerData.push({ trianglePoints: [], state: "setStone" });
        allPlayerData.push({ trianglePoints: [], state: "setStone" });
        // 4人分のパラメータ追加
        allPlayerData[0].trianglePoints.push([{ x: 50, y: 50 }, { x: 50, y: 150 }, { x: 150, y: 150 }]);
        allPlayerData[0].trianglePoints.push([{ x: 50, y: 50 }, { x: 150, y: 150 }, { x: 150, y: 50 }]);
        allPlayerData[0].trianglePoints.push([]);
        allPlayerData[1].trianglePoints.push([{ x: 850, y: 450 }, { x: 850, y: 550 }, { x: 950, y: 550 }]);
        allPlayerData[1].trianglePoints.push([{ x: 850, y: 450 }, { x: 950, y: 550 }, { x: 950, y: 450 }]);
        allPlayerData[1].trianglePoints.push([]);
        allPlayerData[2].trianglePoints.push([{ x: 50, y: 550 }, { x: 50, y: 450 }, { x: 150, y: 450 }]);
        allPlayerData[2].trianglePoints.push([{ x: 50, y: 550 }, { x: 150, y: 450 }, { x: 150, y: 550 }]);
        allPlayerData[2].trianglePoints.push([]);
        allPlayerData[3].trianglePoints.push([{ x: 950, y: 50 }, { x: 850, y: 50 }, { x: 850, y: 150 }]);
        allPlayerData[3].trianglePoints.push([{ x: 950, y: 50 }, { x: 850, y: 150 }, { x: 950, y: 150 }]);
        allPlayerData[3].trianglePoints.push([]);



        // 一例
        //allPlayerData[0].rectPoints.push([{ x: 55, y: 55 }, { x: 300, y: 300 }, { x: 200, y: 150 }, { x: 90, y: 50 }]);


        const playerColors = [Color.red, Color.blue, Color.yellow, Color.green];


        // 現在の陣地を描画する
        const drawZin = (trianglePoints: TrianglePoint, nowPlayer: number) => {
            fillPolygonInContainer(zinGraphics, trianglePoints, playerColors[nowPlayer], 1);
        }
        //showZin(allPlayerData);


        // 強さベクトルの表示
        // スプライトを画面中央に表示
        const vectorObj = this.add.sprite(0, 0, loadImages.vector);
        vectorObj.x = -999;
        vectorObj.scaleY = 0.5;
        vectorObj.setOrigin(0, 0.5);

        // 石の作成
        const stoneObjs: Phaser.GameObjects.Graphics[][] = [];

        // プレイヤーごとに石を管理する
        for (let i = 0; i < allPlayerData.length; i++) {
            stoneObjs.push([]);
        }

        const createStone = (nowPlayer: number, alpha: number) => {
            // objの位置と半径からPhaser.Geom.Circleを作成
            const circle = new Phaser.Geom.Circle(0, 0, 10);


            // 白い境界線を描画
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0xffffff, 1); // 線の太さ、色、不透明度を設定
            graphics.fillStyle(playerColors[nowPlayer], alpha);
            graphics.fillCircleShape(circle); // Geom.Circleを渡して境界線を描画
            graphics.strokeCircleShape(circle); // Geom.Circleを渡して境界線を描画
            stoneObjs[nowPlayer].push(graphics);
            return graphics;
        }

        // 指定したプレイヤーの全ての石を消す
        const clearStones = (player: number) => {
            while (stoneObjs[player].length > 0) {
                const obj = stoneObjs[player].pop();
                obj.destroy(true);
            }
        }

        // 現在のスコア
        // テキストを画面中央に表示
        const scoreLabels: Phaser.GameObjects.Text[] = [];
        const turnCircles: CircleObj[] = [];
        {
            let nx = 50;
            for (const color of playerColors) {
                const scoreLabel = this.add.text(400, 300, 'Hello, Phaser!', {
                    fontSize: '32px',        // フォントサイズ
                    fontFamily: 'Arial',     // フォントファミリー
                    color: numberToColorString(color)        // 文字色（16進数表記）
                });
                scoreLabel.y = 10;
                scoreLabel.x = nx + 20; // テキストの位置を円の右に調整
                scoreLabels.push(scoreLabel);

                // 自分のターンを表す円を表示
                const circle = new CircleObj(this, 10, color);
                circle.x = nx;
                circle.y = 25;
                turnCircles.push(circle);

                nx += 150; // 次のテキストと円の位置を調整
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
        let state: "settingStone" | "targetPoint" | "move" | "end" = "settingStone";
        let turn = 1;
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

        // 移動先の座標
        const targetPos: Point2d = { x: 0, y: 0 };

        this.input.on('pointermove', function (pointer) {
            switch (state) {
                case "targetPoint": {
                    // ベクトルの表示
                    const dx = pointer.x - nowPoint.x;
                    const dy = pointer.y - nowPoint.y;
                    vectorRad = Math.atan2(dy, dx);
                    vectorPower = Math.min(300, Math.sqrt(dx * dx + dy * dy)); // 適宜スケール調整

                    vectorObj.x = nowPoint.x;
                    vectorObj.y = nowPoint.y;
                    vectorObj.rotation = vectorRad;
                    vectorObj.scaleX = vectorPower / 200;
                    break;
                }
            }

        });
        // 画面全体にクリックイベントを設定
        this.input.on('pointerdown', (pointer) => {
            // クリックされた位置の座標を取得

            switch (state) {
                case "settingStone": {
                    // 指定した位置が自分の陣地か調べる
                    if (getColorAtPoint(this, zinGraphics, pointer) !== playerColors[nowPlayer]) {
                        return;
                    }
                    // 石を設置
                    const obj = createStone(nowPlayer, 1);
                    obj.x = pointer.x;
                    obj.y = pointer.y;
                    nowPoint.x = pointer.x;
                    nowPoint.y = pointer.y;

                    // 三角形の頂点を追加
                    const lastIndex = allPlayerData[nowPlayer].trianglePoints.length - 1;
                    allPlayerData[nowPlayer].trianglePoints[lastIndex].push({ x: obj.x, y: obj.y });
                    // 状態を次に変える
                    state = "targetPoint";
                    break;
                }
                case "targetPoint": {

                    // ベクトルの表示
                    const dx = pointer.x - nowPoint.x;
                    const dy = pointer.y - nowPoint.y;
                    vectorRad = Math.atan2(dy, dx);
                    vectorPower = Math.min(300, Math.sqrt(dx * dx + dy * dy)); // 適宜スケール調整

                    targetPoint.x = nowPoint.x + vectorPower * Math.cos(vectorRad);
                    targetPoint.y = nowPoint.y + vectorPower * Math.sin(vectorRad);

                    state = "move";
                    count = 0;

                    break;
                }
            }


        }, this);

        const updateTurnCircles = () => {
            turnCircles.forEach((circle, index) => {
                if (index === nowPlayer) {
                    circle.alpha = 1; // 現在のプレイヤーの円を表示
                } else {
                    circle.alpha = 0; // 他のプレイヤーの円を非表示
                }
            });
        };

        // 最初のターンを設定する
        updateTurnCircles();

        // CPUモードか
        let cpuMode = false;
        // CPUの投げ先
        let cpuThrowPatterns: Point2d[] = [];

        // ターンを切り替える
        const changeTurn = () => {
            // 直前のプレイヤーの最新の石を表示
            clearStones(nowPlayer);
            setStonsByTriangle();

            // ターンを変える
            nowPlayer = (nowPlayer + 1) % allPlayerData.length;

            // 現在のプレイヤーの最新の石を表示
            clearStones(nowPlayer);
            setStonsByTriangle();

            updateTurnCircles();
            //clearStones();
            if (allPlayerData[nowPlayer].state === "setStone") {
                state = "settingStone";
            } else {
                const trianglePoints = allPlayerData[nowPlayer].trianglePoints;
                const nowTriangleLength = trianglePoints.length;  //現在指定の三角形の個数
                const trianglePointsLength = trianglePoints[nowTriangleLength - 1].length; //現在指定の三角形の点の数
                nowPoint.x = trianglePoints[nowTriangleLength - 1][trianglePointsLength - 1].x;
                nowPoint.y = trianglePoints[nowTriangleLength - 1][trianglePointsLength - 1].y;
                state = "targetPoint";
            }
            setScoreLabel();
            // CPUの番であれば、計算して、目的の位置を打つ
            const cputurns = {
                "0CPU": 4,
                "1CPU": 3,
                "2CPU": 2,
                "3CPU": 1,
                "4CPU": 0
            }
            // CPUの番か確認
            if (nowPlayer >= cputurns[this.mode]) {
                cpuMode = true;
                //cpuThrowPatterns = simulateThrowStones(this, nowPlayer, allPlayerData);
            } else {
                cpuMode = false;
            }

            // 
        }

        const actionCPU = () => {
            switch (state) {
                case "settingStone": {


                    count = 0;
                    break;
                }
                case "targetPoint": {

                    break;
                }
            }
        }

        // 最新の三角形の頂点にあたる石を用意する
        const setStonsByTriangle = () => {
            // 初期配置で三角形を2つ用意しているが、これは表示しない
            if (allPlayerData[nowPlayer].trianglePoints.length <= 2) return;
            // 現在作成予定の三角形の点情報を一通り表示する
            const lastIndex = allPlayerData[nowPlayer].trianglePoints.length - 1;
            for (let i = 0; i < allPlayerData[nowPlayer].trianglePoints[lastIndex].length; i++) {
                const trianglePoints = allPlayerData[nowPlayer].trianglePoints[lastIndex][i];
                const obj = createStone(nowPlayer, 0.5);
                obj.x = trianglePoints.x;
                obj.y = trianglePoints.y;
            }
        }

        // updateイベント内で使うためにわざわざprivate変数にするのも面倒なので、
        // create関数内でupdate関数処理が行えるようにする
        ////関数の実体を都合に良い場所で書ける。
        this.updataCallback = () => {
            // もしプレイヤーは陣地内に石を設置していたら
            // CPUの動作
            if (cpuMode) {
                actionCPU();
            }


            switch (state) {
                case "move": {
                    count++;
                    if (count === 1) {
                        vectorObj.x = -999;
                        // 自分の持っている石表示を全て消す
                        clearStones(nowPlayer);
                        throwStone = createStone(nowPlayer, 1);
                        throwStone.x = nowPoint.x;
                        throwStone.y = nowPoint.y;

                        // 現在作成予定の三角形の点情報を一通り表示する
                        setStonsByTriangle();


                    }
                    // 石を動かす
                    throwStone.x = throwStone.x * 0.5 + targetPoint.x * 0.5;
                    throwStone.y = throwStone.y * 0.5 + targetPoint.y * 0.5;

                    if (count >= 15) {
                        // 三角形の頂点を追加
                        allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1].push({ x: throwStone.x, y: throwStone.y });

                        // 範囲外ならば強制終了
                        if (throwStone.x < 50 || throwStone.x > 950 || throwStone.y < 50 || throwStone.y > 550) {
                            allPlayerData[nowPlayer].trianglePoints.pop(); //直前の三角形を消す
                            allPlayerData[nowPlayer].trianglePoints.push([]);
                            allPlayerData[nowPlayer].state = "setStone";
                            clearStones(nowPlayer);
                            changeTurn();
                            return;
                        }
                        console.log(allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1].length);
                        //　もし投げた回数が2以下であれば、どこにも領地が入っていないことが条件となる
                        if (allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1].length <= 2) {
                            for (const color of playerColors) {
                                if (getColorAtPoint(this, zinGraphics, { x: throwStone.x, y: throwStone.y }) === color) {
                                    // 領域に被ったら終わり
                                    allPlayerData[nowPlayer].trianglePoints.pop(); //直前の三角形を消す
                                    allPlayerData[nowPlayer].trianglePoints.push([]);
                                    allPlayerData[nowPlayer].state = "setStone";
                                    clearStones(nowPlayer);
                                    changeTurn();
                                    return;
                                }
                            }
                            allPlayerData[nowPlayer].state = "triangle";
                            changeTurn();
                            return;
                        } else {
                            for (const color of playerColors) {
                                if (getColorAtPoint(this, zinGraphics, { x: throwStone.x, y: throwStone.y }) === color) {
                                    // 領域に被ったら終わり
                                    allPlayerData[nowPlayer].trianglePoints.pop(); //直前の三角形を消す
                                    allPlayerData[nowPlayer].trianglePoints.push([]);
                                    allPlayerData[nowPlayer].state = "setStone";
                                    clearStones(nowPlayer);
                                    changeTurn();
                                    return;
                                }
                            }
                            // もし領地内に他のプレイヤーの石が入っていたら、その石を取り除く
                            const newTrianglePoints = allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1];
                            for (let i = 0; i < allPlayerData.length; i++) {
                                if (i === nowPlayer) continue;
                                const lastIndex = allPlayerData[i].trianglePoints.length - 1;
                                const trianglePoints = allPlayerData[i].trianglePoints[lastIndex];
                                for (let j = 0; j < trianglePoints.length; j++) {
                                    const point = trianglePoints[j];
                                    if (isPointInsidePolygon(newTrianglePoints, point)) {
                                        // 石のデータを取り除く
                                        for (const pos of allPlayerData[i].trianglePoints[lastIndex]) {
                                            const obj = new Explosion(this, pos.x, pos.y, "explosion");
                                        }
                                        allPlayerData[i].trianglePoints.pop();
                                        allPlayerData[i].trianglePoints.push([]);
                                        clearStones(i);
                                        allPlayerData[i].state = "setStone";
                                        break;
                                    }
                                }
                            }
                            drawZin(newTrianglePoints, nowPlayer);
                            // 3点引けた場合は三角形ができるので、次の三角形を準備する
                            // 前回引けた三角形の最後の二点を登録する
                            const prevPoint = {
                                x: allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1][1].x,
                                y: allPlayerData[nowPlayer].trianglePoints[allPlayerData[nowPlayer].trianglePoints.length - 1][1].y
                            };
                            allPlayerData[nowPlayer].trianglePoints.push([prevPoint, { x: throwStone.x, y: throwStone.y }]);
                            changeTurn();

                        }
                    }
                }
            }

        }


        // 初期設定のデータを陣地として描画
        drawZin(allPlayerData[0].trianglePoints[0], 0);
        drawZin(allPlayerData[0].trianglePoints[1], 0);
        drawZin(allPlayerData[1].trianglePoints[0], 1);
        drawZin(allPlayerData[1].trianglePoints[1], 1);
        drawZin(allPlayerData[2].trianglePoints[0], 2);
        drawZin(allPlayerData[2].trianglePoints[1], 2);
        drawZin(allPlayerData[3].trianglePoints[0], 3);
        drawZin(allPlayerData[3].trianglePoints[1], 3);
    }
    update(): void {//delta
        // create関数内で以下関数の中身は定義しておく,変数はthis必要なし
        this.updataCallback();//deltaで引き継いでいく


    }
}