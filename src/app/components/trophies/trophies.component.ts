import { Component, OnInit } from '@angular/core';
import { milestones } from '../../../../constants';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';

@Component({
  selector: 'mean-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css',
              '../../shared/general-styles.css']
})
export class TrophiesComponent implements OnInit {

  completed = [];
  uncompleted = [];
  userDetails: User;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
      for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].maxValue == user.milestones[i]) {
          this.completed.push({ index: 1, milestone: milestones[i]})
        } else {
          this.uncompleted.push({ index: 1, milestone: milestones[i]})
        }
      }
    }, (err) => {
      console.error(err);
    });
    console.log(milestones);
  }

}
