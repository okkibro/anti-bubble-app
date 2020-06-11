import { Component, OnInit, ContentChild } from '@angular/core';
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
    this.auth.profile().subscribe(user => { // Get the user object of the logged in user
      this.userDetails = user;
      for (let i = 0; i < milestones.length; i++) { // Loop over all milestones and sort them into the arrays
        if (milestones[i].maxValue == user.milestones[i]) {
          this.completed.push({ index: i, milestone: milestones[i]})
        } else {
          this.uncompleted.push({ index: i, milestone: milestones[i]})
        }
      }
      this.value = this.completedRatio(); // Set value of progressbar
    }, (err) => {
      console.error(err);
    });
  }

  completedRatio(): string { //Calculates how much % of all milestones the user has completed
    return (this.completed.length / (this.completed.length + this.uncompleted.length) * 100).toFixed(0);
  }

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
