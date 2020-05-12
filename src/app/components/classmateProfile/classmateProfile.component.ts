import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { ActivatedRoute } from "@angular/router";
import { Router } from '@angular/router';

@Component({
  selector: 'mean-classmateProfile',
  templateUrl: './classmateProfile.component.html',
  styleUrls: ['./classmateProfile.component.css',
              '../../shared/general-styles.css']
})
export class ClassmateProfileComponent implements OnInit {

  userDetails: User;

  constructor(private auth: AuthenticationService, private route: ActivatedRoute, private router: Router) { }

  logoutButton() {
    return this.auth.logout();
  }

  ngOnInit() {
    this.auth.classmateProfile(this.route.snapshot.paramMap.get("id")).subscribe(user => {
      this.userDetails = user;
  }, (err) => {
      console.error(err);
      this.router.navigate(['/home']);
  });
  }

}