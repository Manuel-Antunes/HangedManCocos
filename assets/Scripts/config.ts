// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hanged from "./hanged";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Config extends cc.Component {
  @property(cc.EditBox)
  editBox: cc.EditBox = null;

  startGame() {
    const word = this.editBox.string;
    if (word != "" && !this.checkIfThereAreSpacesInWord(word)) {
      cc.director.loadScene("play", (err: Error, scene: cc.Scene) => {
        const hanged = scene
          .getChildByName("Canvas")
          .getChildByName("hanged")
          .getComponent(Hanged);
        hanged.setSecret(word);
      });
    }
  }

  checkIfThereAreSpacesInWord(word: string): boolean {
    let exists: boolean = false;
    for (let i = 0; i < word.length; i++) {
      const letter = word[i];
      if (letter == " ") {
        exists = true;
        break;
      }
    }
    return exists;
  }

  // update (dt) {}
}
