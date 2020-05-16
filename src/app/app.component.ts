import { Component } from "@angular/core";
import { Board, Player } from "./models/board";
import { PathData } from "./models/data";
import { DiceComponent } from "./dice/dice.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "Ludo App";

  board = null;
  coins = [];
  activePlayer = null;
  players = null;

  playerCoins = [];

  ngOnInit() {
    this.players = [
      new Player(1, "red"),
      new Player(2, "blue"),
      new Player(3, "green"),
      new Player(4, "yellow"),
    ];
    this.board = new Board(this.players);

    this.activePlayer = this.players[0];
  }

  ngAfterViewInit() {
    var parent = this;

    setTimeout(() => {
      parent.coins = [
        ...this.players[0].coins,
        ...this.players[1].coins,
        ...this.players[2].coins,
        ...this.players[3].coins,
      ];

      parent.playerCoins.push(parent.players[0].coins);
      parent.playerCoins.push(parent.players[1].coins);
      parent.playerCoins.push(parent.players[2].coins);
      parent.playerCoins.push(parent.players[3].coins);
    });
  }

  rollDice() {
    if (this.board.isDiceActive) {
      this.board.dice = this.randomNumberGenerator(1, 6);
      this.board.isDiceActive = false;

      var d = this.activePlayer.coins.filter(
        (tempCoin) => tempCoin.currentPosition != 0
      );

      // Activate player it will get deactived once player moves
      this.activePlayer.active = true;

      // if no choices then move to next player
      if (d.length <= 0 && this.board.dice !== 6) {
        setTimeout(() => {
          this.activePlayer.active = false;
          this.changePlayer();
        }, 1000);
      }
    }
  }

  onCoinClick(coin) {
    // if player in not active then return
    if (!this.activePlayer.active) {
      return;
    }

    // if clicked coin is player coin the move the slected coin
    this.activePlayer.coins.forEach((ele) => {
      if (coin.id == ele.id) {
        this.activePlayer.activeCoin = coin;

        if (coin.currentPosition === 0 && this.board.dice === 6) {
          this.activePlayer.move();
          this.activePlayer.active = false;
          this.board.isDiceActive = true;
        } else if (coin.currentPosition !== 0) {
          this.move(coin, () => {
            this.changePlayer();
            // this.getCoinPosition();
          });
        }
      }
    });
  }

  move(coin, cb) {
    this.activePlayer.active = false;
    if (coin.currentPosition === 0 && this.board.dice === 6) {
      this.activePlayer.move();
      this.activePlayer.active = false;
      this.board.isDiceActive = true;
      return;
    }

    let theLoop: (i: number, delay?) => void = (i: number, delay = 100) => {
      setTimeout(() => {
        this.activePlayer.move();

        if (--i) {
          theLoop(i);
        } else {
          cb();
        }
      }, delay);
    };
    theLoop(this.board.dice);
  }

  changePlayer() {
    if (this.activePlayer.id === 4) {
      this.activePlayer = this.board.players[0];
    } else {
      this.activePlayer = this.board.players[this.activePlayer.id];
    }
    this.board.isDiceActive = true;
  }

  killAnimation() {
    let currPos = this.activePlayer.activeCoin.currentPosition;
    let theLoop: (i: number, delay?) => void = (i: number, delay = 25) => {
      setTimeout(() => {
        this.activePlayer.moveReverse();
        i--;
        if (i > -1) {
          theLoop(i);
        }
      }, delay);
    };
    theLoop(currPos + 1);
  }

  getCoinPosition() {
    // return "transform('translateX:" + this.activePlayer.activeCoin.x + "px')";
    try {
      var id =
        this.activePlayer.activeCoin.x + ":" + this.activePlayer.activeCoin.y;
      var ele = document.getElementById(id);
      var rect = {
        left: ele.offsetLeft + 9,
        top: ele.offsetTop + 7,
      };

      return "translate(" + rect.left + "px," + rect.top + "px)";
    } catch {}

    return this.activePlayer.activeCoin.x;
  }

  getCoinXYPosition(coin) {
    var id = coin.x + ":" + coin.y;
    var ele = document.getElementById(id);
    if (ele != undefined) {
      var rect = { left: ele.offsetLeft + 9, top: ele.offsetTop + 7 };
      return "translate(" + rect.left + "px," + rect.top + "px)";
    }

    return "translate(" + 0 + "px," + 0 + "px)";
  }

  getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  }

  drawHomes(x, y) {
    var path = this.activePlayer.visitedBoxs.find(function (ele) {
      return ele.x === x && ele.y === y;
    });
    var coin =
      this.activePlayer.activeCoin.x === x &&
      this.activePlayer.activeCoin.y === y;

    if (path && !coin) {
      return this.activePlayer.color;
    }

    if (coin) {
      return this.activePlayer.color;
    }
  }

  randomNumberGenerator(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
