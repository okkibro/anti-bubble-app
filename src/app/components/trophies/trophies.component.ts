import { Component, OnInit, ContentChild } from '@angular/core';
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

<<<<<<< HEAD
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
=======
  constructor() { }

  ngOnInit() {

    var trophy_Image: string = "../../../assets/images/trophy_vb.jpg";
    var image = document.createElement("img");
    image.setAttribute("src", trophy_Image);
    image.style.height = "25vh";                    
    image.style.width = "15vw"; 
    
    var tabje = document.getElementById("matTab");
    tabje.appendChild(image);
  }

  
  progressBar(){

    var achievedTable = document.getElementById("achievedTable").getElementsByTagName('tr');
    var notAchievedTable = document.getElementById("notYetAchievedTable").getElementsByTagName('tr');
  
    var achievedRowCount = achievedTable.length;
    var notAchievedRowCount = notAchievedTable.length;

    var totalAchievements = achievedRowCount + notAchievedRowCount;
    var progress = achievedRowCount / totalAchievements * 100;
   
   
    console.log(progress);
    return progress;
  }

}




>>>>>>> origin/bubble-avatar-changes
