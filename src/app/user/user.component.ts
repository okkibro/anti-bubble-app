import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mean-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  register_redirect(): void {
    this.router.navigate(["register"])
  }

}
