import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
    selector: 'mean-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css',
        '../../shared/general-styles.css']
})
export class HomeComponent implements OnInit {
    isTeacher: boolean = this.auth.isTeacher();

    constructor(private auth: AuthenticationService) { }

    logoutButton(): void {
        return this.auth.logout();
    }

    ngOnInit(): void { }
}
