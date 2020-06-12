import { Component, OnInit } from '@angular/core';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchage.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from '../../models/user';

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

  constructor(
    private socketService: SocketIOService,
    private router: Router,
    private data: DataService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.gameData = this.getGameData();

    this.auth.profile().subscribe(user => {
      this.userDetails = user;
    });

    this.data.currentMessage.subscribe(message => {
      if (message) {
        this.pin = message;
        this.socketService.pin = message;
      }
    });

    window.addEventListener('beforeunload', this.beforeUnload);

    if (this.gameData == undefined) {
      this.router.navigate(['home']);
    }

    this.receiveQuestion(); // check whether or not a teacher has sent a question

    this.receiveTeam();
  }

  beforeUnload(e) {
    e.returnValue = "Weet je zeker dat je de sessie wilt verlaten?";
    return "Weet je zeker dat je de sessie wilt verlaten?";
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
    this.socketService.listenForTeam((team) => {
      this.team = team;
    });
  }

}



