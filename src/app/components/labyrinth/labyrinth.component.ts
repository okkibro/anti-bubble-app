import { Component, OnInit, HostListener } from '@angular/core';
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
  // interval;
  nextQuestionDisabled: boolean;
  questions = [];
  part: Number;
  answers: [{ question: any, answer: any}] = [,];
  currentQuestion;

  @HostListener("change") function() {
    if (this.checkBoxCount() == 0) {
      this.nextQuestionDisabled = true;
    } else {
      this.nextQuestionDisabled = false;
    }
  };

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // Start the labyrinth in part 1.
    this.part = 1;
  }


  /** Function that saves answers the user gave and sets their bubble initialization to true so they can join a session after this. */
  performedLabyrinth() {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth().subscribe(data => {
        console.log(data.succes);
        if (data.succes) {  // Labyrinth boolean is set to true. Player now has a bubble and can join activity sessions.
          this.sessionService.saveAnswers(this.answers).subscribe(() => { // Saves the answers in the database.
            // clearInterval(this.interval);
            this.router.navigate(['home']);
          });
        } else {
          // TODO: opvangen fout tijdens doorlopen van doolhof
        }
      });
    });
  }

  /** Function that starts the labyrinth. */
  startLabyrinth() {
    this.startedLabyrinth = true; // Shows the question screen due to ngIfs in the HTML.
    this.sessionService.getShuffledQuestions(1).subscribe(questions => { // Get the part 1 questions from the database.
      this.questions = questions;
      // this.startTimer(300); // labyrinth activity is 5 minutes, therefore 300 seconds
      this.nextQuestion(null); // Show the first question, previous question does not exist so its null.
    })
  }

  paused(){
    this.snackBar.open('Doolhof gepauzeerd. Zorg dat je het voor de volgende les hebt afgemaakt.', 'X', { duration: 2500, panelClass: ['style-warning'], }).afterDismissed().subscribe(() => {
              // TODO: opslaan waar je was
              this.router.navigate(['home']);
            });
  }

  // /** Function that handles starting the timer, showing it on screen and handling what happens when the time is up. */
  // startTimer(time: number) {
  //   // Timeout that triggers when the time us up.
  //   setTimeout(() => {
  //     // TODO: iets
  //   }, time * 1000);

  //   // Interval that triggers every second until the time is up.
  //   this.interval = setInterval(() => { // Every second...
  //     if (time > 0) {
  //       time -= 1; // Descrease time by 1.

  //       // Calculate the minutes and seconds left and show the on the screen.
  //       let minutes = Math.floor(time / 60);
  //       let seconds = time % 60;
  //       if (seconds < 10) {
  //         document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:0${seconds}</strong>`; // add extra 0 before single digits 
  //       } else {
  //         document.getElementsByClassName('timeLeft')[0].innerHTML = `Tijd over: <br><strong>${minutes}:${seconds}</strong>`;
  //       }
  //     } else {

  //       //When time is up clear interval, show message and go back to the home screen.
  //       clearInterval(this.interval);
  //       this.snackBar.open('De tijd is op. Je wordt omgeleid naar de homepage.', 'X', { duration: 2500, panelClass: ['style-warning'], }).afterDismissed().subscribe(() => {
  //         this.performedLabyrinth();
  //       });
  //     }
  //   }, 1000);
  // }

  /** Function that shows the next question on the screen. */
  nextQuestion(prevQuestion) {
    this.nextQuestionDisabled = true;
    if (this.questions.length === 0) {
      if (this.part === 1) { 
        // If at the end of part 1, go to part 2.
        this.part = 2;
        this.sessionService.getShuffledQuestions(2).subscribe(questions => {
          this.questions = questions;
          this.nextQuestion(prevQuestion);
        });
      } else {
        // If at the end of part 2, finish labyrinth.
        this.saveQuestion(prevQuestion);
        this.performedLabyrinth(); //TODO: Make screen that tells the user they have finished the labyrinth
      }
    } else {
      let question = this.questions.shift(); // Get next question from array.
      this.currentQuestion = question;

      if (prevQuestion != null) {
        this.saveQuestion(prevQuestion); // If its not the first question, save previous question.
      }

      this.showQuestion(question); // Show the qustion on the screen.
    }
  }

  /** Function that counts how many checkboxes have been checked. */
  checkBoxCount() {
    let checkboxes: any = document.getElementsByClassName('option'); // Get all checkboxes in an array.
    let count = 0;
    for (let i = 0; i < checkboxes.length; i++) { // Loop over all the checkboxes.
      if(checkboxes[i].checked) {
        count++; // If the checkbox is checked, count++.
      }
    }
    return count;
  }

  /** Function that saves a question to this.answers. */
  saveQuestion(question) {
    let checkboxes: any = document.getElementsByClassName('option'); // Get all checkboxes in an array.
    let result = [];
    for (let i = 0; i < checkboxes.length; i++) { // Loop over all the checkboxes.
      result.push(checkboxes[i].checked); // Save checked in result array.
    }
    this.answers.push({ question: question, answer: result }); // Push the result with its corresponding question to this.answers.
  }

  /** Function that shows a question on the screen. */
  showQuestion(question) {
    document.getElementById('question').innerHTML = question.question; // Set question title.
    let radioGroup = document.getElementsByClassName('radioButtonOptions')[0];
    let options = "";
    let type = "";
    if (question.multipleAnswers) { // If a question can have multiple answers, use a checkbox, otherwise use a radiobutton.
      type = "checkbox";
    } else {
      type = "radio";
    }
    for (let i = 0; i < question.choices.length; i++) { // For each question...
      options += `<input type="${type}" class="option" name="options">${question.choices[i]}</input><br>` // Add a checkbox/radiobutton to options.
    }
    radioGroup.innerHTML = options; // Place all checkboxes/radiobuttons on the screen.
  }
}
