/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from '../../services/socket-io.service';
import { FormBuilder } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchange.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beforeUnload } from '../../../../constants';
import { SessionService } from 'src/app/services/session.service';

@Component({
    selector: 'mean-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css',
        '../../shared/general-styles.css']
})

export class HomeComponent implements OnInit {
    userDetails: User;
    pin: string;

    constructor(
        private auth: AuthenticationService,
        private socketService: SocketIOService,
        private fb: FormBuilder,
        private router: Router,
        private data: DataService,
        private snackBar: MatSnackBar,
        private sessionService: SessionService,
    ) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
        });
    }

    /** Method to redirect a student to the labyrinth page. */
    startLabyrinth() {
        this.router.navigate(['labyrinth']);
    }

    /** Method to redirect a teacher to the session page. */
    createSession() {
        this.router.navigate(['session-options']);
    }
    
    /** Method to join a session based on the filled in code. */
    joinSession() {
        const user = this.userDetails;

        // Call the joinsession function in socketio service and define all callbacks.
        this.socketService.joinSession(this.pin, user, (succes) => {

            // Join callback: succes returns true if pin was correct and false when pin is incorrect.
            if (succes) {
                this.router.navigate(['session']); // On join succes, go to session page.
            } else {

                // On join jail, show error message.
                this.snackBar.open('Er is iets mis gegaan, probeer het opnieuw', 'X', { duration: 2500, panelClass: ['style-error'], });
            }
        }, () => {

            // backToHome callback: show message that host left and navigate to home page afterwards.
            this.snackBar.open('De host heeft de sessie verlaten, je wordt naar de home pagina geleid', 'X', { duration: 2500, panelClass: ['style-warning'] })
                .afterDismissed().subscribe(() => {
                    this.router.navigate(['home']);
                });
                 window.removeEventListener('beforeunload', beforeUnload);
        }, () => {

            // redirect callback: go to activities page when the game starts.
            this.router.navigate(['activities']);
        }, () => {

            // finishedGame callback: earn money
            this.sessionService.earnMoney(100).subscribe();
        });

    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
