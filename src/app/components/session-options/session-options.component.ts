import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SessionService } from 'src/app/services/session.service';
import { MatRadioButton } from '@angular/material/radio';

@Component({
  selector: 'mean-session-options',
  templateUrl: './session-options.component.html',
  styleUrls: ['./session-options.component.css',
    '../../shared/general-styles.css']
})
export class SessionOptionsComponent implements OnInit {

  userDetails: User;

  teamOptions: string[] = ['Willekeurig', 'Handmatig'];
  teamOptionBB: string;
  teamOptionAA: string;

  constructor(private auth: AuthenticationService, private router: Router, private socketService: SocketIOService, private sessionService: SessionService) { }

  ngOnInit() { 
    // set the default value for building teams on random
    this.teamOptionBB = 'Willekeurig';
    this.teamOptionAA = 'Willekeurig';
  }

  // Gets called when teacher presses create session button. gamedata contains the name of the game and time of the slider
  createSession(gameData) {
    this.sessionService.getActivity(gameData?.game).subscribe(data => { // Get the entire activity data from the database
      gameData.game = data;
      this.socketService.createSession(gameData); // Create a session in socket io service and pass it the chosen activity with set options
      this.router.navigate(['session']); // Navigate to session page
    });
  }

  logoutButton() {
    return this.auth.logout();
  }

}
