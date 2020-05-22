import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user';
import { FormBuilder, Validators } from '@angular/forms';
import { Class } from 'src/app/models/classes';
import { ClassesService } from 'src/app/services/classes.service';

@Component({
    selector: 'mean-teacher-overview',
    templateUrl: './teacher-overview.component.html',
    styleUrls: ['./teacher-overview.component.css',
        '../../shared/general-styles.css']
})
export class TeacherOverviewComponent implements OnInit {
    userDetails: User;
    classForm = this.fb.group({
        classTitle: ['', Validators.required],
        classLevel: ['', Validators.required],
        classYear: ['', Validators.required]
    });
    openform = false;

    constructor(private authenticationService: AuthenticationService, private classService: ClassesService, private fb: FormBuilder) { }

    ngOnInit(): void { 
        this.authenticationService.profile().subscribe(user => {
            this.userDetails = user;
        })
    }

    createClass() {
        if (this.userDetails.role == 'teacher') {
            let classes = new Class();
            classes.code  = Math.floor(100000 + Math.random() * 900000);;
            classes.level = this.classForm.get('classLevel').value;
            classes.title = this.classForm.get('classTitle').value;
            classes.year  = this.classForm.get('classYear').value;
            this.openform = false;

            this.classService.createClass(classes, this.userDetails).subscribe(() => {
                this.classService.joinClass(classes.code);
            });
        } else {
            console.log('you are not eligible to create a class')
        }
    }

    onClickOpenForm(){
        this.openform = true;  
    }
}
