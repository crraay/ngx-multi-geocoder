import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { AigeoModule } from "./modules/aigeo/aigeo.module";


@NgModule({
    declarations: [
        RootComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        AigeoModule,
    ],
    providers: [],
    bootstrap: [RootComponent]
})
export class AppModule { }
