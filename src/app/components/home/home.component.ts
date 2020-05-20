import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from '../../services/socket-io.service';
import { FormBuilder, Validators } from "@angular/forms";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { PointInteractionEventObject } from 'highcharts';
import { DataService } from 'src/app/services/data-exchage.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'mean-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css',
        '../../shared/general-styles.css']
})

export class HomeComponent implements OnInit {
    userDetails: User;
    pin: string;
    isTeacher: boolean = this.authenticationService.isTeacher();
    joinSessionForm = this.fb.group({
        sessionCode: ['', Validators.required]
    });

    constructor(
        private authenticationService: AuthenticationService,
        private socketService: SocketIOService,
        private fb: FormBuilder,
        private router: Router,
        private data: DataService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.authenticationService.profile().subscribe(user => {
            this.userDetails = user;
        })
     }

    logoutButton() {
        return this.authenticationService.logout();
    }

    createSession() {
        this.socketService.createSession();
        this.router.navigate(['session']);
    }

    joinSession() {
        const email = this.userDetails.email;
        this.socketService.joinSession(this.pin, email, (succes) => {
            if (succes) {
                this.router.navigate(['session']);
            } else {
                this.snackBar.open("Er is iets mis gegaan, probeer het opnieuw", 'X', {duration: 2500, panelClass: ['style-error'], });
            }
        });
    }
}
