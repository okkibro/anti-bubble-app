import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { SessionService } from '../../services/session.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'mean-labyrinth',
  templateUrl: './labyrinth.component.html',
  styleUrls: ['./labyrinth.component.css',
    '../../shared/general-styles.css']
})
export class LabyrinthComponent implements OnInit {

  userDetails: User;

  constructor(private router: Router, private sessionService: SessionService, private auth: AuthenticationService) { }

  ngOnInit(): void { }

  performedLabyrinth(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;

      this.sessionService.performedLabyrinth(this.userDetails.email).subscribe(data => {
        if (data.succes) {
          console.log("doolhof afgerond");
          this.router.navigate(['home']);
        } else {
          console.log("doolhof niet afgerond");
        }
      });
    });

  }

  logoutButton(): void {
    return this.auth.logout();
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */