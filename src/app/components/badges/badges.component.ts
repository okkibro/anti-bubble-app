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
    this.auth.profile().subscribe(user => {
      this.userDetails = user;
      for (let i = 0; i < milestones.length; i++) {
        if (milestones[i].maxValue == user.milestones[i]) {
          this.completed.push({ index: i, milestone: milestones[i]})
        } else {
          this.uncompleted.push({ index: i, milestone: milestones[i]})
        }
      }
      //document.getElementsByClassName("progressBar")[0].setAttribute("aria-valuenow", this.completedRatio());
      this.value = this.completedRatio();
    }, (err) => {
      console.error(err);
    });
  }

  completedRatio(): string {
    return (this.completed.length / (this.completed.length + this.uncompleted.length) * 100).toFixed(0);
  }

}
