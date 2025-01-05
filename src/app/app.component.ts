import {
  Component,
  TemplateRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import confetti from 'canvas-confetti';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  @ViewChild('modal', { static: false }) winnerModal!: TemplateRef<any>;

  interval: any = 0;
  winner: string = '';
  resetBtn: boolean = true;
  title = 'tic-tac-toe';
  nextPlayer: boolean = false;
  stopInput: boolean = false;
  list = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  ngOnInit(): void {}
  checkAllInput() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
      if ((cells[i] as HTMLElement).style.backgroundImage != '') {
        this.resetBtn = false;
        return;
      }
    }
  }
  insertInput(i: any) {
    if (!this.stopInput) {
      // console.log(i);
      let cells = document.querySelectorAll('.cell');
      if ((cells[i] as HTMLElement).style.backgroundImage != '') {
        return;
      }
      navigator.vibrate(100);
      if (this.nextPlayer) {
        (cells[i] as HTMLElement).style.backgroundImage = "url('o.svg')";
        (cells[i] as HTMLElement).style.scale = '0.8';
      } else (cells[i] as HTMLElement).style.backgroundImage = "url('x.svg')";

      this.nextPlayer = !this.nextPlayer;
      this.checkWinner();
    }
  }
  checkWinner() {
    for (let i = 0; i < this.wins.length; i++) {
      // possibility
      const poss = this.wins[i];
      // console.log(poss);

      let winner = [];
      for (let j = 0; j < poss.length; j++) {
        let cells = document.querySelectorAll('.cell');

        winner.push((cells[poss[j]] as HTMLElement).style.backgroundImage);
      }
      // console.log(winner);
      // console.log(winner);

      if (
        winner[0].includes('o.svg') &&
        winner[1].includes('o.svg') &&
        winner[2].includes('o.svg')
      ) {
        this.winner = 'O';
        console.log('O is the winner');
        this.stopInput = true;
        this.triggerConfetti();
        // this.openDialog();
        this.resetBtn = false;
        return;
      }
      if (
        winner[0].includes('x.svg') &&
        winner[1].includes('x.svg') &&
        winner[2].includes('x.svg')
      ) {
        console.log('X is the winner');
        this.winner = 'X';
        this.stopInput = true;
        this.triggerConfetti();
        // this.openDialog();
        this.resetBtn = false;
        return;
      }
      this.checkAllInput();
      // console.log(winner);
    }
  }

  private triggerConfetti(): void {
    // 1
    var count = 200;
    var defaults1 = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio: any, opts: any) {
      confetti({
        ...defaults1,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });

    // 2
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: any, max: any) {
      return Math.random() * (max - min) + min;
    }

    this.interval = setInterval(() => {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(this.interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  }
  openDialog() {
    const dialogRef = this.dialog.open(this.winnerModal);

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
    });
  }
  resetGame() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++) {
      (cells[i] as HTMLElement).style.backgroundImage = '';
      (cells[i] as HTMLElement).style.scale = '1';
    }
    this.nextPlayer = false;
    this.stopInput = false;
    this.resetBtn = true;
    this.winner = '';
    confetti.reset();
    clearInterval(this.interval);
  }
}
