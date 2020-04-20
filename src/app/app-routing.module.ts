import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';

import { AuthGuardService} from './services/auth-guard.service';
import { ClassOverviewComponent } from './components/class-overview/class-overview.component';
import { ClassmateProfileComponent } from './components/classmateProfile/classmateProfile.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BubbleDetailsComponent } from './components/bubble-details/bubble-details.component';
import { TeacherOrStudentComponent } from './components/teacherOrStudent/teacherOrStudent.component';
import { ShopComponent } from './components/shop/shop.component';

const routes: Routes = [
  { path: '', redirectTo: '/teacherOrStudent', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]},
  { path: 'class-overview', component: ClassOverviewComponent },
  { path: 'classmateProfile', component: ClassmateProfileComponent },
  { path: 'avatar', component: AvatarComponent },
  { path: 'bubble-details', component: BubbleDetailsComponent },
  { path: 'teacherOrStudent', component: TeacherOrStudentComponent },
  { path: 'shop', component: ShopComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
