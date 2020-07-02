/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Role } from './models/role'

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SessionComponent } from "./components/session/session.component";
import { ClassOverviewComponent } from './components/class-overview/class-overview.component';
import { ClassmateProfileComponent } from './components/classmate-profile/classmate-profile.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BubbleDetailsComponent } from './components/bubble-details/bubble-details.component';
import { TeacherOverviewComponent } from './components/teacher-overview/teacher-overview.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ShopComponent } from './components/shop/shop.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { BadgesComponent } from './components/badges/badges.component';
import { SessionGuardService } from './services/session-guard.service';
import { SessionOptionsComponent } from './components/session-options/session-options.component';
import { LabyrinthComponent } from './components/labyrinth/labyrinth.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { LabyrinthGuardService } from './services/labyrinth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'session', component: SessionComponent, canActivate: [AuthGuardService], canDeactivate: [SessionGuardService]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'class-overview', component: ClassOverviewComponent, canActivate: [AuthGuardService] },
  { path: 'classmate-profile/:id', component: ClassmateProfileComponent, canActivate: [AuthGuardService] },
  { path: 'avatar', component: AvatarComponent, canActivate: [AuthGuardService] },
  { path: 'bubble-details', component: BubbleDetailsComponent, canActivate: [AuthGuardService], data: { roles: [Role.student] }},
  { path: 'teacher-overview', component: TeacherOverviewComponent, canActivate: [AuthGuardService], data: { roles: [Role.teacher] }},
  { path: 'badges', component: BadgesComponent, canActivate: [AuthGuardService] },
  { path: 'shop', component: ShopComponent, canActivate: [AuthGuardService] },
  { path: 'passwordrecovery', component: PasswordRecoveryComponent },
  { path: 'reset/:token', component: PasswordResetComponent },
  { path: 'labyrinth', component: LabyrinthComponent, canActivate: [LabyrinthGuardService] },
  { path: 'session-options', component: SessionOptionsComponent, canActivate: [AuthGuardService] , data: { roles: [Role.teacher] }},
  { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuardService], canDeactivate: [SessionGuardService]},

  // Automatically redirect to login page when user inputs a wrong URL.
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */