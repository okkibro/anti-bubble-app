/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { FormBuilder } from '@angular/forms';
import { ClassesService } from '../../services/classes.service';

@Component({
  selector: 'mean-class-overview',
  templateUrl: './class-overview.component.html',
  styleUrls: ['./class-overview.component.css',
    '../../shared/general-styles.css']
})

export class ClassOverviewComponent implements OnInit {
  searchBar = this.fb.group({
    query: ['', []]
  });

  classmates: User[];
  userClassTitle;

  public value: string;

  constructor(
    private classService: ClassesService,
    private auth: AuthenticationService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.classService.getClass().subscribe((data) => {
      if (data.succes) {
        this.userClassTitle = data.class.title;
        this.classmates = data.classmates;
      }
    });
  }

  /** Method to filter the students in a class. */
  search() {
    let query: string = this.searchBar.get('query').value.toLowerCase();
    let table = document.getElementById('table').childNodes;
    for (let i: number = 0; i < this.classmates.length; i++) {
      if (this.classmates[i].firstName.toLowerCase().includes(query) || this.classmates[i].lastName.toLowerCase().includes(query)) {
        (table[i + 1] as HTMLElement).style.display = '';
      } else {
        (table[i + 1] as HTMLElement).style.display = 'none';
      }
    }
  }

  /** Method to clear the filter so all students are displayed again. */
  clear() {
    this.value = '';
    let table = document.getElementById('table').childNodes;
    for (let i: number = 0; i < this.classmates.length; i++) {
      (table[i + 1] as HTMLElement).style.display = '';
    }
  }
}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */
