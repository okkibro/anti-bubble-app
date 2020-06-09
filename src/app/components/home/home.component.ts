import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from '../../services/socket-io.service';
import { FormBuilder, Validators } from "@angular/forms";
import { User } from "../../models/user";
import { Router } from "@angular/router";
import { PointInteractionEventObject } from 'highcharts';
import { DataService } from 'src/app/services/data-exchange.service';
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

    // Method to redirect a student to the labyrinth page
    startLabyrinth() {
        this.router.navigate(['labyrinth']);
    }

    // Method to redirect a teacher to the session page.
    createSession() {
        // this.socketService.createSession();
        this.router.navigate(['session-options']);
    }
    
    //Method to join a session based on the filled in code.
    joinSession() {
        const user = this.userDetails;
        this.socketService.joinSession(this.pin, user, (succes) => {
            if (succes) {
                this.router.navigate(['session']);
            } else {
                this.snackBar.open("Er is iets mis gegaan, probeer het opnieuw", 'X', { duration: 2500, panelClass: ['style-error'], });
            }
        }, () => {
            this.snackBar.open("De host heeft de sessie verlaten, je wordt naar de home pagina geleid", 'X', { duration: 2500, panelClass: ['style-warning'] })
                .afterDismissed().subscribe(() => { this.router.navigate(['home']) });
        }, () => {
                this.router.navigate(['activities']);
        });
    }

    // Method to logout.
    logoutButton() {
        return this.authenticationService.logout();
    }
}
