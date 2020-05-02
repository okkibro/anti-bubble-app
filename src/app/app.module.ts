// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { HighchartsChartModule } from 'highcharts-angular';
import { FlexLayoutModule } from "@angular/flex-layout"; 
import {MatTabsModule} from '@angular/material/tabs';

// core modules
import { CustomMaterialModule } from './shared/material.module';
import { AppRoutingModule } from './app-routing.module';

// component modules
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { ClassOverviewComponent } from './components/class-overview/class-overview.component';
import { ClassmateProfileComponent } from './components/classmateProfile/classmateProfile.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { BubbleDetailsComponent } from './components/bubble-details/bubble-details.component';
import { TeacherOrStudentComponent } from './components/teacherOrStudent/teacherOrStudent.component';
import { ShopComponent } from './components/shop/shop.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { TrophiesComponent } from './components/trophies/trophies.component';

// services
import { AuthGuardService } from './services/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';
import { SocketIOService } from './services/socket-io.service';
import { SessionComponent } from './components/session/session.component';
import { TeacherOverviewComponent } from './components/teacher-overview/teacher-overview.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';



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
        TeacherOrStudentComponent,
        TeacherOverviewComponent,
        ShopComponent,
        NavBarComponent,
        PasswordRecoveryComponent,
        PasswordResetComponent,
        TrophiesComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        HighchartsChartModule,
        FlexLayoutModule,
        MatTabsModule,
        MatProgressBarModule,
    ],
    providers: [AuthGuardService, CookieService, SocketIOService],
    bootstrap: [AppComponent]
})
export class AppModule { }
