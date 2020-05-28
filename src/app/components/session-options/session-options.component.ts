import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'mean-session-options',
  templateUrl: './session-options.component.html',
  styleUrls: ['./session-options.component.css',
    '../../shared/general-styles.css']
})
export class SessionOptionsComponent implements OnInit {

  userDetails: User;

  constructor(private auth: AuthenticationService, private router: Router, private socketService: SocketIOService, ) { }

  ngOnInit(): void {
  }

  createSession(gameData) {
    this.socketService.createSession(gameData);
    this.router.navigate(['session']);
  }

  logoutButton() {
    return this.auth.logout();
  }
}
