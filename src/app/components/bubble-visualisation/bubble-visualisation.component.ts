/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'mean-bubble-visualisation',
  templateUrl: './bubble-visualisation.component.html',
  styleUrls: ['./bubble-visualisation.component.css',
    '../../shared/general-styles.css']
})
export class BubbleVisualisationComponent implements OnInit {
  userDetails: User;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
      console.log(user.bubble);
      this.updateBubble();
    }, (err) => {
      console.error(err);
    });

  }

  /** Method that updates the visual representation of a users bubble based on their statistics. */
  updateBubble() {
    let mainstream = this.userDetails.bubble.mainstream.pop();
    let online = this.userDetails.bubble.online.pop();
    let social = this.userDetails.bubble.social.pop();
    let category1 = this.userDetails.bubble.category1.pop();
    let category2 = this.userDetails.bubble.category2.pop();

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
  getHighestIndex(inputValues, nameValues) {
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

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
