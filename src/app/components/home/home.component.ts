import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from '../../services/socket-io.service';

@Component({
  selector: 'mean-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private socketService: SocketIOService) { }

  ngOnInit(): void {

  }
  
  logoutButton() {
    return this.authenticationService.logout();
  }

  createSession() {
    this.socketService.createSession();
  }

  joinSession() {
    this.socketService.joinSession();
  }
  
}
