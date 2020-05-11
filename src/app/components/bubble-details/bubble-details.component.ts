import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import * as Highcharts from 'highcharts-angular';

import { analyzeAndValidateNgModules } from '@angular/compiler';
import * as Highcharts2 from "highcharts";


@Component({
  selector: 'mean-bubble-details',
  templateUrl: './bubble-details.component.html',
  styleUrls: ['./bubble-details.component.css',
    '../../shared/general-styles.css']
})
export class BubbleDetailsComponent implements OnInit {

  charts = Highcharts2;

  chartConstructor = 'chart'; // optional string, defaults to 'chart'

  chartCallback = function (chart) { } // optional function, defaults to null
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngularFlag = false; // optional boolean, defaults to false

  chartOptions = {}

  initChart() {
    this.chartOptions = {
      chart: {
        type: "spline"
      },
      title: {
        text: "Bubbel Geschiedenis"
      },
      subtitle: {
        text: "Veranderingen van je bubbel over de tijd"
      },
      xAxis: {
        categories: ["Sessie 1", "Sessie 2", "Sessie 3", "Sessie 4", "Sessie 5", "Sessie 6", "Sessie 7"]
      },
      yAxis: {
        title: {
          text: "Percentage (%)"
        },
        visible: true,
      },
      tooltip: {
        valueSuffix: " %"
      },
      series: [
        {
          name: 'Diversiteit van de inhoud',
          color: 'yellow',
          data: [7, 6, 9, 14, 18, 21, 25]
        },
        {
          name: 'Kennis en bewustzijn van filter bubbles',
          color: 'blue',
          data: [12, 13, 17, 29, 25, 26, 31]
        }
      ]
    };
  }


  userDetails: User;

  constructor(private auth: AuthenticationService) {

  }

  logoutButton() {
    return this.auth.logout();
  }

  ngOnInit() {
    this.initChart();

  }

}