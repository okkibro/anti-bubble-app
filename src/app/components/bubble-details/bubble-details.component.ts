import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
// import * as Highcharts from 'highcharts-angular';

@Component({
  selector: 'mean-bubble-details',
  templateUrl: './bubble-details.component.html',
  styleUrls: ['./bubble-details.component.css',
              '../../shared/general-styles.css']
})
export class BubbleDetailsComponent implements OnInit {

//   data = [{
//     name: 'ItSolutionStuff.com',
//     data: [500, 700, 555, 444, 777, 877, 944, 567, 666, 789, 456, 654]
//  },{
//     name: 'Nicesnippets.com',
//     data: [677, 455, 677, 877, 455, 778, 888, 567, 785, 488, 567, 654]
//  }];

//   highcharts = Highcharts;

//   chartOptions = {   
//     chart: {
//        type: "spline"
//     },
//     title: {
//        text: "Monthly Site Visitor"
//     },
//     xAxis:{
//        categories:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
//     },
//     yAxis: {          
//        title:{
//           text:"Visitors"
//        } 
//     },
//     series: this.data
//   };
 
  userDetails: User;

  constructor(private authenticationService: AuthenticationService) {

   }

  logoutButton() {
    return this.authenticationService.logout();
  }

  ngOnInit(): void {
  }

}