export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
    }

    preload() {
        // 必要なアセットをロード
    }

    create() {
        // All human ボタン
        const allHumanButton = this.add.text(400, 200, 'All Human', { fontSize: '32px', color: '#fff' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainScene', { mode: '0CPU' });
            });

        {
            // 1CPU ボタン
            const cpuButton = this.add.text(400, 250, 'vs.1CPU', { fontSize: '32px', color: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('MainScene', { mode: '1CPU' });
                });
        }
        {
            // 2CPU ボタン
            const cpuButton = this.add.text(400, 300, 'vs.2CPU', { fontSize: '32px', color: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('MainScene', { mode: '2CPU' });
                });
        }
        {
            // 3CPU ボタン
            const cpuButton = this.add.text(400, 350, 'vs.3CPU', { fontSize: '32px', color: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('MainScene', { mode: '3CPU' });
                });
        }

        {
            // 4CPU ボタン
            const cpuButton = this.add.text(400, 400, 'vs.4CPU', { fontSize: '32px', color: '#fff' })
                .setInteractive()
                .on('pointerdown', () => {
                    this.scene.start('MainScene', { mode: '4CPU' });
                });
        }

    }
}