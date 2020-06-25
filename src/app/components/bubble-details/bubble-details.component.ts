/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import * as Highcharts2 from 'highcharts';

@Component({
    selector: 'mean-bubble-details',
    templateUrl: './bubble-details.component.html',
    styleUrls: ['./bubble-details.component.css',
        '../../shared/general-styles.css']
})
export class BubbleDetailsComponent implements OnInit {

    charts = Highcharts2;

    // Optional string, defaults to 'chart'.
    chartConstructor = 'chart';

    // Optional function, defaults to null.
    chartCallback = function (chart) { }

    // Optional boolean.
    updateFlag = false;

    // Optional boolean, defaults to false.
    oneToOneFlag = true;

    // Optional boolean, defaults to false.
    runOutsideAngularFlag = false;
    chartOptions = {}
    userDetails: User;

    /*TODO DONT MAKE THIS HARDCODED BUT READ OF USER BUBBLE HISTORY */
    data = {online: [0,1,1,2,3,4,4],
            social: [0,0,1,1,1,2,2],
            mainstream: [0,0,1,2,3,3,4],
            category1: [0,0,1,2,2,2,4],
            category2: [0,2,3,4,4,4,4],
            knowledge: [0,0,0,1,2,4,5],
            techSavvy: [0,1,2,4,4,4,4]}

    constructor(private auth: AuthenticationService) {}

    ngOnInit() {
        this.auth.profile().subscribe(user => {
            this.userDetails = user;
            this.initChart();
        })

    }

    initChart() {
        this.chartOptions = {
            chart: {
                type: 'spline'
            },
            title: {
                text: 'Bubbel Geschiedenis'
            },
            subtitle: {
                text: 'Veranderingen van je bubbel over de tijd'
            },
            xAxis: {
                categories: ['Sessie 1', 'Sessie 2', 'Sessie 3', 'Sessie 4', 'Sessie 5', 'Sessie 6', 'Sessie 7']
            },
            yAxis: {
                title: {
                    text: 'Points'
                },
                visible: true,
            },
            series: [
                {
                    name: 'Online',
                    color: 'grey',
                    data: this.data.online,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Social',
                    color: 'blue',
                    data: this.data.social,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Mainstream',
                    color: 'green',
                    data: this.data.mainstream,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Category 1',
                    color: 'red',
                    data: this.data.category1,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Category 2',
                    color: 'blue',
                    data: this.data.category2,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Knowledge',
                    color: 'yellow',
                    data: this.data.knowledge,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
                {
                    name: 'Techsavvyness',
                    color: 'green',
                    data: this.data.techSavvy,
                    tooltip: {
                        valueSuffix: 'pt'
                    }
                },
            ]
        };
    }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
