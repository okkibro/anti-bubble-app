import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'mean-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  note = 'Client app is running!';

  constructor() {}

  ngOnInit() {
  }
}
