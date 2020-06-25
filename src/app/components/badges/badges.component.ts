/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { milestones } from '../../../../constants';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'mean-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.css',
    '../../shared/general-styles.css']
})
export class BadgesComponent implements OnInit {

  completed = [];
  uncompleted = [];
  userDetails: User;
  value: string;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
       // Loop over all milestones and sort them into the arrays.
      for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].maxValue == user.milestones[i]) {
          this.completed.push({ index: i, milestone: milestones[i] })
        } else {
          this.uncompleted.push({ index: i, milestone: milestones[i] })
        }
      }
      // Set value of progressbar.
      this.value = this.completedRatio(); 
    }, (err) => {
      console.error(err);
    });
  }

  /** Method to calculate how far you are in completing all milestones. */
  completedRatio(): string {
    return (this.completed.length / (this.completed.length + this.uncompleted.length) * 100).toFixed(0);
  }

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
