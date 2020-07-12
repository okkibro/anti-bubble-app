/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    selector: 'mean-avatar-display',
    templateUrl: './avatar-display.component.html',
    styleUrls: ['./avatar-display.component.css']
})
export class AvatarDisplayComponent implements OnInit {
    userDetails: User;

    constructor(private auth: AuthenticationService) { }

    ngOnInit(): void {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            this.showAvatar(user);
        });
    }

    /** Method to show the avatar, taking the object from the database */
    showAvatar(user: User) {
        document.getElementById('haar1').setAttribute('src', user.avatar.haar?.fullImage2);
        document.getElementById('lichaam').setAttribute('src', user.avatar.lichaam.fullImage);
        document.getElementById('broek').setAttribute('src', user.avatar.broek.fullImage);
        document.getElementById('shirt').setAttribute('src', user.avatar.shirt.fullImage);
        document.getElementById('schoenen').setAttribute('src', user.avatar.schoenen?.fullImage);
        document.getElementById('bril').setAttribute('src', user.avatar.bril?.fullImage);
        document.getElementById('haar2').setAttribute('src', user.avatar.haar?.fullImage);
        document.getElementById('hoofddeksel').setAttribute('src', user.avatar.hoofddeksel?.fullImage);
        document.getElementById('medaille').setAttribute('src', user.avatar.medaille?.fullImage);
    }
}
