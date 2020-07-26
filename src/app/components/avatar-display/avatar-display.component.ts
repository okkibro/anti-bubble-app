/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { ActivatedRoute } from "@angular/router";
import { ClassesService } from "../../services/classes.service";
import { UserService } from "../../services/user.service";

@Component({
    selector: 'mean-avatar-display',
    templateUrl: './avatar-display.component.html',
    styleUrls: ['./avatar-display.component.css']
})

export class AvatarDisplayComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private classService: ClassesService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.get('id')) {
            this.classService.classmateProfile(this.route.snapshot.paramMap.get('id')).subscribe(classmate => {
                this.showAvatar(classmate);
            });
        } else {
            this.userService.profile().subscribe(user => {
                this.showAvatar(user);
            });
        }
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
