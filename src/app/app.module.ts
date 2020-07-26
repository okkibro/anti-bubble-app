/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

// Angular modules.
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// Core modules.
import { CustomMaterialModule } from './shared/material.module';
import { AppRoutingModule } from './app-routing.module';
// Component modules.
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ClassOverviewComponent, LeaveClassDialog } from './components/class-overview/class-overview.component';
import { ClassmateProfileComponent } from './components/classmate-profile/classmate-profile.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BubbleDetailsComponent } from './components/bubble-details/bubble-details.component';
import { ShopComponent } from './components/shop/shop.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { BadgesComponent } from './components/badges/badges.component';
import { SessionComponent } from './components/session/session.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import {
    DeleteClassDialog,
    RemoveFromClassDialog,
    TeacherOverviewComponent
} from './components/teacher-overview/teacher-overview.component';
import { JoinClassComponent } from './components/join-class/join-class.component';
import { BubbleVisualisationComponent } from './components/bubble-visualisation/bubble-visualisation.component';
import { SessionOptionsComponent } from './components/session-options/session-options.component';
import { LabyrinthComponent } from './components/labyrinth/labyrinth.component';
import { AnswerFormComponent } from './components/answer-form/answer-form.component';
import { AvatarDisplayComponent } from './components/avatar-display/avatar-display.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NotLoggedInToolbarComponent } from './components/not-logged-in-toolbar/not-logged-in-toolbar.component';
import { DeleteAccountDialog, SettingsComponent } from './components/settings/settings.component';
// Services.
import { AuthGuardService } from './services/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketIOService } from './services/socket-io.service';
import { SessionGuardService } from "./services/session-guard.service";
import { AuthenticationService } from "./services/authentication.service";
import { AvatarService } from "./services/avatar.service";
import { BubbleGraphService } from "./services/bubble-graph.service";
import { ClassesService } from "./services/classes.service";
import { DataService } from "./services/data-exchange.service";
import { MilestoneUpdatesService } from "./services/milestone-updates.service";
import { ShopService } from "./services/shop.service";
import { UserService } from "./services/user.service";


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        HomeComponent,
        SessionComponent,
        ClassOverviewComponent,
        ClassmateProfileComponent,
        AvatarComponent,
        BubbleDetailsComponent,
        TeacherOverviewComponent,
        ShopComponent,
        ActivitiesComponent,
        PasswordRecoveryComponent,
        PasswordResetComponent,
        JoinClassComponent,
        BubbleVisualisationComponent,
        BadgesComponent,
        SessionOptionsComponent,
        LabyrinthComponent,
        AnswerFormComponent,
        AvatarDisplayComponent,
        ToolbarComponent,
        SidenavComponent,
        NotLoggedInToolbarComponent,
        DeleteAccountDialog,
        DeleteClassDialog,
        LeaveClassDialog,
        RemoveFromClassDialog,
        SettingsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        HighchartsChartModule,
        MatSliderModule,
        FlexLayoutModule,
        MatTabsModule,
        MatProgressBarModule,
        FormsModule,
        MatRadioModule,
        MatSidenavModule,
        MatListModule,
        MatSelectModule,
    ],
    providers: [
        AuthGuardService,
        CookieService,
        SocketIOService,
        SessionGuardService,
        AuthenticationService,
        AvatarService,
        BubbleGraphService,
        ClassesService,
        DataService,
        MilestoneUpdatesService,
        ShopService,
        UserService
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }