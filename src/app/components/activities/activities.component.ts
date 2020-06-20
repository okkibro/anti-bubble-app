import { Component, OnInit } from '@angular/core';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchange.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../models/user';
import { beforeUnload } from '../../../../constants';
import { Articles } from '../../models/articles';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'mean-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css',
    '../../shared/general-styles.css']
})
export class ActivitiesComponent implements OnInit {

  gameData;
  pin;
  userDetails: User;
  enableAnswer: boolean = false;
  team;
  articleImages = [];
  leaders;
  selected;
  isLeader: Boolean = true;
  submitted: Boolean = false;
  article;

  constructor(
    private socketService: SocketIOService,
    private router: Router,
    private data: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.gameData = this.getGameData();

    this.data.currentMessage.subscribe(message => {
      if (message) {
        this.pin = message;
        this.socketService.pin = message;
      }
    });

    window.addEventListener('beforeunload', beforeUnload);

    if (this.gameData == undefined) {
      this.router.navigate(['home']);
    }

    this.receiveQuestion(); // Check whether or not a teacher has sent a question

    this.receiveTeam(); // Get teams from teacher's input
  }

  leaveSession() {
    this.socketService.leaveSession();
  }

  isHostDisconnected(): boolean {
    return this.socketService.hostDisconnected;
  }

  getGameData(): any {
    return this.socketService.gameData;
  }

  receiveQuestion() {
    // Students listen for incoming questions.
    this.socketService.listenForQuestion((question) => { // Receive question.
      let questionDisplay = document.getElementById('receiveQuestion');
      questionDisplay.innerHTML = question;
      this.enableAnswer = true; // student can only answer after the teacher has submitted a question
    });
  }

  receiveTeam() {
    this.socketService.listenForTeam((team, article, leaders) => {
      this.leaders = leaders;
      this.article = article;
      this.auth.profile().subscribe(user => {
        this.userDetails = user;
        if (leaders.find(x => x.email == this.userDetails.email) == undefined) {
          this.isLeader = false;
        }
      });
      this.team = team;
      let articleSpace = document.getElementsByClassName("article")[0];
      let image = document.createElement("img");
      image.setAttribute("src", article.image);
      image.setAttribute("width", "200px");
      image.setAttribute("height", "200px");
      articleSpace.appendChild(image);

    });
  }

  /** Function that submits an answer and data to the teacher. */
  submit(data) {
    this.submitted = true;
    this.socketService.studentSubmit({ answer: this.selected, data: data });
  }

}



