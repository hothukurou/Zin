import 'phaser';
import { MainScene } from './main';

const config: Phaser.Types.Core.GameConfig = {
    width: 1000,
    height: 600,
    type: Phaser.AUTO,
    backgroundColor: 0x333333,
    parent: 'game',
    scene: [MainScene],
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener('load', () => {
    const game = new Game(config);
});