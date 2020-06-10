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
  interval;
  questions = [];
  part: Number;
  answers: [{ question: any, answer: any}] = [,];
  currentQuestion;

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.part = 1;
  }

  performedLabyrinth() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth(this.userDetails.email).subscribe(data => {
        if (data.succes) {  // labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
          this.sessionService.saveAnswers(this.answers).subscribe();
          this.router.navigate(['home']);
        } else {
          // TODO: opvangen fout tijdens doorlopen van doolhof
        }
      });
    });
  }

  startLabyrinth() {
    this.startedLabyrinth = true;
    this.sessionService.getShuffledQuestions(1).subscribe(questions => {
      this.questions = questions;
      this.startTimer(300); // labyrinth activity is 5 minutes, therefore 300 seconds
      this.nextQuestion(null);
    })
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
        this.snackBar.open('De tijd is op. Je wordt omgeleid naar de homepage.', 'X', { duration: 2500, panelClass: ['style-warning'], }).afterDismissed().subscribe(() => {
          clearInterval(this.interval);
          this.performedLabyrinth();
        });
      }
    }, 1000);
  }

  nextQuestion(prevQuestion) {
    if (this.questions.length === 0) {
      if (this.part === 1) {
        this.part = 2;
        this.sessionService.getShuffledQuestions(2).subscribe(questions => {
          this.questions = questions;
          this.nextQuestion(prevQuestion);
        });
      } else {
        this.saveQuestion(prevQuestion);
        this.sessionService.saveAnswers(this.answers).subscribe();
        clearInterval(this.interval);
        this.router.navigate(['home']); //TODO: Make screen that tells the user they have finished the labyrinth
      }
    } else {
      let question = this.questions.shift();
      this.currentQuestion = question;

      if (prevQuestion != null) {
        this.saveQuestion(prevQuestion);
      }

      this.showQuestion(question);
    }
  }

  checkBoxCount() {
    let checkboxes: any = document.getElementsByClassName('option');
    let count = 0;
    for (let i = 0; i < checkboxes.length; i++) {
      if(checkboxes[i].checked) {
        count++;
      }
    }
    return count;
  }

  saveQuestion(question) {
    let checkboxes: any = document.getElementsByClassName('option');
    let result = [];
    for (let i = 0; i < checkboxes.length; i++) {
      result.push(checkboxes[i].checked);
    }
    this.answers.push({ question: question, answer: result })
  }

  showQuestion(question) {
    // Show question on screen
    document.getElementById('question').innerHTML = question.question;

    let radioGroup = document.getElementsByClassName('radioButtonOptions')[0];
    let options = "";
    let type = "";
    if (question.multipleAnswers) {
      type = "checkbox";
    } else {
      type = "radio";
    }
    for (let i = 0; i < question.choices.length; i++) {
      options += `<input type="${type}" class="option" name="options">${question.choices[i]}</input><br>`
    }
    radioGroup.innerHTML = options;
  }
}
