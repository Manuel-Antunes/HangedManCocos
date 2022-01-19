// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Hanged extends cc.Component {
  secret: string;
  wordNode: cc.Node = null;

  @property(cc.EditBox)
  editBox: cc.EditBox = null;

  @property(cc.Label)
  guessedLettersLabel: cc.Label = null;

  @property(cc.Prefab)
  letterPrefab: cc.Prefab = null;

  guessedLetters: string[] = [];

  @property(cc.Node)
  man: cc.Node = null;

  @property(cc.Button)
  submitButton: cc.Button = null;

  letters: cc.Label[] = [];

  lifePoints: number;

  onLoad() {
    this.wordNode = this.node.getChildByName("word");
  }

  start() {
    this.buildHangedSecret();
    const word = this.getCurrentWord();
    this.lifePoints = 6;
  }

  setSecret(secret: string) {
    this.secret = secret;
  }

  guessLetter() {
    const guessedLetter = this.editBox.string;
    const exists = this.guessedLetters.find(letter => {
      if (guessedLetter == letter) {
        return true;
      } else {
        return false;
      }
    });
    if (!exists && guessedLetter != "") {
      if (this.secret.includes(guessedLetter)) {
        this.showLetterInSecretWord(guessedLetter);
      } else {
        this.dealDamageInHangedMan();
      }
      this.guessedLetters.push(guessedLetter);
    }
    this.clearEditField();
    this.generateGuessedLettersMessage();
  }

  dealDamageInHangedMan() {
    this.man.children[6 - this.lifePoints].active = true;
    this.lifePoints--;
    if (this.lifePoints == 0) {
      console.log("perdeu");
      this.gameOver();
    }
  }

  gameOver() {
    this.submitButton.node.active = false;
    this.editBox.node.active = false;
    setTimeout(() => {
      cc.director.loadScene("config");
    }, 2000);
  }

  clearEditField() {
    this.editBox.string = "";
  }

  showLetterInSecretWord(letter: string) {
    for (let i = 0; i < this.secret.length; i++) {
      const s = this.secret[i];
      if (s == letter) {
        this.letters[i].string = letter;
      }
    }
    this.verifyIfPlayerWins();
  }

  verifyIfPlayerWins() {
    if (this.secret == this.getCurrentWord()) {
      console.log("ganhou");
      this.gameOver();
    }
  }

  buildHangedSecret() {
    for (let i = 0; i < this.secret.length; i++) {
      const nodeLetter = cc.instantiate(this.letterPrefab);
      nodeLetter.x = i * (nodeLetter.x + 110);
      this.letters.push(
        nodeLetter.getChildByName("label").getComponent(cc.Label)
      );
      this.wordNode.addChild(nodeLetter);
      this.wordNode.x -= 30 + i;
    }
  }

  getCurrentWord(): string {
    let word = "";
    this.letters.forEach(letter => {
      word += letter.string;
    });
    return word;
  }

  generateGuessedLettersMessage() {
    this.guessedLettersLabel.string = `Letras Digitadas: ${this.guessedLetters.join(
      ","
    )}`;
  }
  // update (dt) {}
}
