import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { User } from '../../models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'mean-answer-form',
    templateUrl: './answer-form.component.html',
    styleUrls: ['./answer-form.component.css',
        '../../shared/general-styles.css']
})
export class AnswerFormComponent implements OnInit {

    answer = "";
    question = "";
    getAnswerForm = this.fb.group({
        getAnswer: ['', []]
    });
    sendQuestionsForm = this.fb.group({
        getQuestion: ['', []]
    });
    userDetails: User;

    constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private socketService: SocketIOService, private auth: AuthenticationService) { }

    alreadySubmitted:boolean = false;

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
    })

    this.socketService.reactivateButton(() => { // Reactivate the option to answer after the teacher has deleted the answer
      this.alreadySubmitted = false;
    });
  }

    // This method lets students submit an answer to the teacher (digiboard).
    sendAnswer() {
        if (this.answer != "") {
            this.socketService.studentSubmit(this.answer);
            this.answer = "";
            this.alreadySubmitted = true; // prevents students from spamming the teacher with answers
        } else {
            this.snackBar.open('Vul een antwoord in', 'X', { duration: 2500, panelClass: ['style-error'] });
        }
    }

  // This method lets a teacher submit a question to all of the students in the session.
  sendQuestion() {
    if (this.question != "") {
      this.socketService.sendQuestion(this.question);
      this.question = "";
    } else {
      this.snackBar.open('Vul een onderwerp in', 'X', { duration: 2500, panelClass: ['style-error'], });
    }
  }
}
