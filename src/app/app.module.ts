// angular modules
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FlexLayoutModule } from "@angular/flex-layout";

// core modules
import { CustomMaterialModule } from './shared/material.module';
import { AppRoutingModule } from './app-routing.module';

// component modules
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';

// services
import { AuthGuardService } from './services/auth-guard.service';
import { CookieService } from 'ngx-cookie-service';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        HomeComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CustomMaterialModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FlexLayoutModule,
    ],
    providers: [AuthGuardService, CookieService],
    bootstrap: [AppComponent]
})
export class AppModule { }
