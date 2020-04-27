import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { Variable } from '@angular/compiler/src/render3/r3_ast';

@Component({
    selector: 'mean-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.css',
        '../../shared/general-styles.css']
})
export class AvatarComponent implements OnInit {

    userDetails: User;

    constructor(private auth: AuthenticationService) { }

    logoutButton() {
        return this.auth.logout();
    }

    ngOnInit() {
        this.skincolorTab(); //display skin colors on init
    }
 
    tabChange(event) {
         var currentTab = event.tab.textLabel;
         var collection = document.getElementById("itemCollection"); 

         //replace existing images with the images corresponding to the clicked tab
         if(currentTab == "Huidskleur"){     
            collection.lastChild.replaceWith(this.skincolorTab());    
         }
         else if(currentTab == "Kleding"){
            collection.lastChild.replaceWith(this.clothingTab());
         }
         else {
            collection.lastChild.replaceWith(this.hatTab());
         }
    }

    skincolorTab(){
        var images: string[] = ["../../../assets/images/brown.jpg",
            "../../../assets/images/beige.png",
            "../../../assets/images/darkbrown.jpg"];

        var skincolorTab = document.getElementById("itemCollection");
        var tab = document.createElement("mat-tab");

        for (var i = 0; i < images.length; i++) {
            var image = document.createElement("img");
            image.setAttribute("src", images[i]);
            image.style.height = "75%";
            image.style.width = "20%";
            image.style.padding = "0.5%";
            tab.appendChild(image);
        }

        skincolorTab.appendChild(tab);
        return tab;   
    }

    clothingTab(){
        var images: string[] = ["../../../assets/images/pants.png",
            "../../../assets/images/shirt.png",
            "../../../assets/images/dress.png"];

        var clothingTab = document.getElementById("itemCollection");
        var tab = document.createElement("mat-tab");

        for (var i = 0; i < images.length; i++) {
            var image = document.createElement("img");
            image.setAttribute("src", images[i]);
            image.style.height = "75%";
            image.style.width = "20%";
            image.style.padding = "0.5%";
            tab.appendChild(image);
        }

        clothingTab.appendChild(tab);
        return tab;
    }

    hatTab(){
        var images: string[] = ["../../../assets/images/hat.png",
            "../../../assets/images/sombrero.jpg"];

        var hatTab = document.getElementById("itemCollection");
        var tab = document.createElement("mat-tab");

        for (var i = 0; i < images.length; i++) {
            var image = document.createElement("img");
            image.setAttribute("src", images[i]);
            image.style.height = "75%";
            image.style.width = "20%";
            image.style.padding = "0.5%";
            tab.appendChild(image);
        }

        hatTab.appendChild(tab);
        return tab;
    }

}