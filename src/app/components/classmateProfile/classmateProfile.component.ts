import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
  selector: 'mean-classmateProfile',
  templateUrl: './classmateProfile.component.html',
  styleUrls: ['./classmateProfile.component.css',
    '../../shared/general-styles.css']
})
export class ClassmateProfileComponent implements OnInit {

  classmate: User;
  user: User;

  constructor(private classService: ClassesService, private auth: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  logoutButton(): void {
    return this.auth.logout();
  }

  ngOnInit() {
    this.classService.classmateProfile(this.route.snapshot.paramMap.get("id")).subscribe(classmate => {
      this.classmate = classmate;
    }, (err) => {
      console.error(err);
      this.router.navigate(['/home']);
    });
    this.auth.profile().subscribe(user => {
      this.user = user;
    })
  }

}

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */