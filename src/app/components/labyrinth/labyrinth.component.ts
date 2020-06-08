import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'mean-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css',
    '../../shared/general-styles.css']
})
export class LabyrinthComponent implements OnInit {

  userDetails: User;
  startedLabyrinth: boolean;
  lastSelected;
  interval;

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  performedLabyrinth() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth(this.userDetails.email).subscribe(data => {
        if (data.succes) {
          this.router.navigate(['home']);
        } else {
          // TODO: opvangen fout tijdens doorlopen van doolhof
        }
      });
    });
  }

  logoutButton() {
    return this.auth.logout();
  }

  startLabyrinth() {
    this.startedLabyrinth = true;
    this.startTimer(10); // labyrinth activity is 5 minutes, therefore 300 seconds
    // this.nextQuestion();
  }

  startTimer(time: number) {
    setTimeout(() => {
      // TODO: iets
    }, time * 1000);
    this.interval = setInterval(() => {
      if (time > 0) {
        time -= 1;
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) {
          document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`; // add extra 0 before single digits 
        } else {
          document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
        }
      } else {
        clearInterval(this.interval);
        this.snackBar.open('De tijd is op. Je wordt omgeleid naar de homepage.', 'X', { duration: 2500, panelClass: ['style-warning'], });
        this.router.navigate(['home']); // TODO: Dit gaat echt te snel
      }
    }, 1000);
  }

  onItemChange(value: string) {
    this.lastSelected = value; // get selected radio button value
  }

  nextQuestion() {
    if (this.lastSelected != undefined) {
      console.log("Je hebt gekozen voor: " + this.lastSelected); //TODO: sla dit antwoord ergens op
      // TODO: laat volgende vraag (en opties) zien
    } else {
      this.snackBar.open('Vul een antwoord in', 'X', { duration: 2500, panelClass: ['style-error'], });
    }
  }
}
