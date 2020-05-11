import { Component, OnInit, ContentChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'mean-trophies',
  templateUrl: './trophies.component.html',
  styleUrls: ['./trophies.component.css',
              '../../shared/general-styles.css']
})
export class TrophiesComponent implements OnInit {

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




