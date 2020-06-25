/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { SocketIOService } from 'src/app/services/socket-io.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { SessionService } from 'src/app/services/session.service';

@Component({
    selector: 'mean-session-options',
    templateUrl: './session-options.component.html',
    styleUrls: ['./session-options.component.css',
        '../../shared/general-styles.css']
})
export class SessionOptionsComponent implements OnInit {

    userDetails: User;

    teamOptions: string[] = ['Willekeurig', 'Handmatig'];
    teamOptionAA: string;

    constructor(
        private auth: AuthenticationService,
        private router: Router,
        private socketService: SocketIOService,
        private sessionService: SessionService
    ) { }

    ngOnInit() {

        // Set the default value for building teams on random.
        this.teamOptionAA = 'Willekeurig';
    }

    /** Method that fets called when teacher presses create session button. gamedata contains the name of the game and time of the slider. */
    createSession(gameData) {

        // Get the entire activity data from the database
        this.sessionService.getActivity(gameData.game).subscribe(data => {
            gameData.game = data;

            // Create a session in socket io service and pass it the chosen activity with set options
            this.socketService.createSession(gameData);

            // Navigate to session page
            this.router.navigate(['session']);
        });
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
