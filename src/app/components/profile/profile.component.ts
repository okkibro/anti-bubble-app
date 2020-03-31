import {Component, OnInit} from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
    selector: 'mean-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
    userDetails: User;

    constructor(private auth: AuthenticationService) {}

    logoutButton() {
      return this.auth.logout();
    }

    ngOnInit() {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        }, (err) => {
            console.error(err);
        });
    }
}
