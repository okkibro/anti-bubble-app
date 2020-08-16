/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { ClassesService } from '../../services/classes.service';

@Component({
    selector: 'mean-bubble-visualisation',
    templateUrl: './bubble-visualisation.component.html',
    styleUrls: ['./bubble-visualisation.component.css',
        '../../shared/general-styles.css']
})

export class BubbleVisualisationComponent implements OnInit {

    constructor(private userService: UserService, private route: ActivatedRoute, private classService: ClassesService) { }

    ngOnInit(): void {
        if (this.route.snapshot.paramMap.get('id')) {
            this.classService.classmateProfile(this.route.snapshot.paramMap.get('id')).subscribe(classmate => {
                this.updateBubble(classmate);
            });
        } else {
            this.userService.profile().subscribe(user => {
                this.updateBubble(user);
            });
        }
    }

    /** Method that updates the visual representation of a users bubble based on their statistics. */
    updateBubble(user: User): void {
        let mainstream = user.bubble.mainstream.pop();
        let online = user.bubble.online.pop();
        let social = user.bubble.social.pop();
        let category1 = user.bubble.category1.pop();
        let category2 = user.bubble.category2.pop();

        let rightValues = [mainstream, social,online];
        let rightValuePaths = ['/assets/images/Super_Map/Bubble_UI/UI_Bubble_Turquoise.png', '/assets/images/Super_Map/Bubble_UI/UI_Bubble_Green.png', '/assets/images/Super_Map/Bubble_UI/UI_Bubble_Purple.png'];
        let rightHighestRated = this.getHighestIndex(rightValues, rightValuePaths);

        let rightHalf = document.getElementById('rightHalf');
        rightHalf.setAttribute('src', rightHighestRated);

        let leftValues = [category1, category2];
        let leftValuePaths = ['/assets/images/Super_Map/Bubble_UI/UI_Bubble_Blue.png', '/assets/images/Super_Map/Bubble_UI/UI_Bubble_Orange.png'];
        let leftHighestRated = this.getHighestIndex(leftValues, leftValuePaths);

        let leftHalf = document.getElementById('leftHalf');
        leftHalf.setAttribute('src', leftHighestRated);
    }

    /** Method that returns the name (from the second array) of the highest value from the first array, */
    getHighestIndex(inputValues, nameValues): string {
        let currentMax = -1;
        let currentName = 'wrong';
        for (let i = 0; i < inputValues.length; i++) {
            if (inputValues[i] > currentMax) {
                currentMax = inputValues[i];
                currentName = nameValues[i];
            }
        }
        return currentName;
    }
}
