import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { LeafletMapComponent } from "./components/leaflet-map/leaflet-map.component";
import { AigeoGeocoderService } from "./services/aigeo-geocoder.service";
import { GoogleGeocoderService } from "./services/google-geocoder.service";
import { YandexGeocoderService } from "./services/yandex-geocoder.service";


@NgModule({
    declarations: [
        RootComponent,
        LeafletMapComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        LeafletModule
    ],
    providers: [
        AigeoGeocoderService,
        GoogleGeocoderService,
        YandexGeocoderService,
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
