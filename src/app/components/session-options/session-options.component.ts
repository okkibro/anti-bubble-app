import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Activity } from '../../models/activity';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'mean-session-options',
  templateUrl: './session-options.component.html',
  styleUrls: ['./session-options.component.css',
    '../../shared/general-styles.css']
})
export class SessionOptionsComponent implements OnInit {

  userDetails: User;
  activityDetails: Activity;
  buttonStatus = true;
  labyrinthButton = false;

  constructor(private auth: AuthenticationService, private router: Router, private socketService: SocketIOService, private sessionService: SessionService) { }

  ngOnInit(): void {
  }

  createSession(gameData) {
    this.sessionService.getActivity(gameData?.game).subscribe(data => {
      gameData.game = data;

      if (gameData.game.name == "Dwalende Doolhof" && !this.activityDetails?.completed) {
        this.buttonStatus = false;
        this.labyrinthButton = true;
        // Hier moet de activityDetails.completed dus nog op true komen te staan, lukt me niet (iig niet dat ie na refresh nog steeds true is)
        // console.log(this.activityDetails?.completed);
      }

      this.socketService.createSession(gameData);
      this.router.navigate(['session']);
    });
  }

  logoutButton() {
    return this.auth.logout();
  }

}
