/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { SocketIOService } from '../../services/socket-io.service';
import { FormBuilder, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data-exchange.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { beforeUnload, milestones } from '../../../../constants';
import { SessionService } from 'src/app/services/session.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { UserService } from "../../services/user.service";
import { MilestoneUpdatesService } from "../../services/milestone-updates.service";

@Component({
    selector: 'mean-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css',
        '../../shared/general-styles.css']
})

export class HomeComponent implements OnInit {
    userDetails: User;
    earnAmount: number = 5;
    joinSessionForm = this.fb.group({
        pin: ['', Validators.required]
    });

    constructor(
        private socketService: SocketIOService,
        private fb: FormBuilder,
        private router: Router,
        private data: DataService,
        private snackBar: MatSnackBar,
        private sessionService: SessionService,
        private titleService: Title,
        private userService: UserService,
        private milestoneUpdates: MilestoneUpdatesService
    ) { }

    ngOnInit(): void {
        this.userService.profile().subscribe(user => {
            this.userDetails = user;
        });

        this.titleService.setTitle('Home' + environment.TITLE_TRAIL);
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
        this.socketService.joinSession(this.joinSessionForm.get('pin').value, user, (succes) => {

            // Join callback: succes returns true if pin was correct and false when pin is incorrect.
            if (succes) {

                // On join succes, go to session page.
                this.router.navigate(['session']);
            } else {

                // On join fail, show error message.
                this.snackBar.open('Er is iets mis gegaan, check de code en probeer het opnieuw', 'X', { duration: 2500, panelClass: ['style-error'] });
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

            // finishedGame callback: earn money and process milestones
            this.sessionService.earnMoney(this.earnAmount).subscribe();
            this.milestoneUpdates.updateMilestone(milestones[1], this.earnAmount).subscribe(data => {
                if (data.completed) {
                    this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Kleine Spaarder' verdiend!`).subscribe();
                    this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Kleine Spaarder\' verdiend! \uD83C\uDF89', 'X', { duration: 4000, panelClass: ['style-succes'] });
                }
            });
            this.milestoneUpdates.updateMilestone(milestones[7], this.earnAmount).subscribe(data => {
                if (data.completed) {
                    this.milestoneUpdates.updateRecent(`${new Date().toLocaleDateString()}: Je hebt de badge 'Money Maker' verdiend!`).subscribe();
                    this.snackBar.open('\uD83C\uDF89 Gefeliciteerd! Je hebt de badge \'Money Maker\' verdiend! \uD83C\uDF89', 'X', { duration: 4000, panelClass: ['style-succes'] });
                }
            });
        });
    }

    /** Method that makes sure you can only fill in numbers in the session code input field. */
    check(event: KeyboardEvent) {
        let code =  event.code.charCodeAt(0);
        if (code != 68) {
            event.preventDefault();
        }
    }
}
