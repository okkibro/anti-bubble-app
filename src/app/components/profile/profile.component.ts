import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'mean-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
    currentUser: Object = {};

    constructor(public authService: AuthService, private actRoute: ActivatedRoute
    ) {
        let id = this.actRoute.snapshot.paramMap.get('id');
        this.authService.getUserProfile(id).subscribe(res => {
            this.currentUser = res.msg;
        })
    }

    ngOnInit() { }
}