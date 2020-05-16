import { Component, OnInit } from "@angular/core";

@Component({
  selector: "dice",
  templateUrl: "./dice.component.html",
  styleUrls: ["./dice.component.css"],
})
export class DiceComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  rollDice() {
    const dice = document.getElementById(".die-list");
    this.toggleClasses(dice);
    dice.dataset.roll = this.getRandomNumber(1, 6);
  }

  toggleClasses(die) {
    die.classList.toggle("odd-roll");
    die.classList.toggle("even-roll");
  }

  getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
