/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

import { NgModule } from '@angular/core';
import { Role } from './models/role';
import { RouterModule, Routes } from '@angular/router';

import { ActivitiesComponent } from './components/activities/activities.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BadgesComponent } from './components/badges/badges.component';
import { BubbleDetailsComponent } from './components/bubble-details/bubble-details.component';
import { ClassOverviewComponent } from './components/class-overview/class-overview.component';
import { ClassmateProfileComponent } from './components/classmate-profile/classmate-profile.component';
import { HomeComponent } from './components/home/home.component';
import { LabyrinthComponent } from './components/labyrinth/labyrinth.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SessionOptionsComponent } from './components/session-options/session-options.component';
import { SessionOverviewComponent } from './components/session-overview/session-overview.component';
import { SessionComponent } from './components/session/session.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ShopComponent } from './components/shop/shop.component';
import { TeacherOverviewComponent } from './components/teacher-overview/teacher-overview.component';

import { AuthGuardService } from './services/auth-guard.service';
import { LabyrinthGuardService } from './services/labyrinth-guard.service';
import { SessionGuardService } from './services/session-guard.service';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuardService], canDeactivate: [SessionGuardService] },
	{ path: 'avatar', component: AvatarComponent, canActivate: [AuthGuardService] },
	{ path: 'badges', component: BadgesComponent, canActivate: [AuthGuardService], data: { roles: [Role.student] }},
	{ path: 'bubble-details', component: BubbleDetailsComponent, canActivate: [AuthGuardService], data: { roles: [Role.student] }},
	{ path: 'class-overview', component: ClassOverviewComponent, canActivate: [AuthGuardService] },
	{ path: 'classmate-profile/:id', component: ClassmateProfileComponent, canActivate: [AuthGuardService] },
	{ path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
	{ path: 'labyrinth', component: LabyrinthComponent, canActivate: [LabyrinthGuardService] },
	{ path: 'login', component: LoginComponent },
	{ path: 'passwordrecovery', component: PasswordRecoveryComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
	{ path: 'register', component: RegisterComponent },
	{ path: 'session', component: SessionComponent, canActivate: [AuthGuardService], canDeactivate: [SessionGuardService] },
	{ path: 'session-options', component: SessionOptionsComponent, canActivate: [AuthGuardService], data: { roles: [Role.teacher] }},
	{ path: 'session-overview', component: SessionOverviewComponent, canActivate: [AuthGuardService], data: { roles: [Role.teacher] }},
	{ path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
	{ path: 'shop', component: ShopComponent, canActivate: [AuthGuardService] },
	{ path: 'teacher-overview', component: TeacherOverviewComponent, canActivate: [AuthGuardService], data: { roles: [Role.teacher] }},
	{ path: 'reset/:token', component: PasswordResetComponent },

	// Automatically redirect to login page when user inputs a wrong URL.
	{ path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})

export class AppRoutingModule {
}