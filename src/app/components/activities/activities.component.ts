import { Component, OnInit } from '@angular/core';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchage.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'mean-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css',
    '../../shared/general-styles.css']
})
export class ActivitiesComponent implements OnInit {

  gameData;
  pin;

  constructor(private socketService: SocketIOService, private router: Router, private data: DataService, private fb: FormBuilder, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.gameData = this.getGameData();

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

}



