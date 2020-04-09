import { Component, OnInit } from '@angular/core';
import { SocketIOService } from './services/socket-io.service';

@Component({
  selector: 'mean-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  note = 'Client app is running!';

  constructor(private socketService: SocketIOService) {}

  ngOnInit() {
    this.socketService.setupSocketConnection();
  }
}
