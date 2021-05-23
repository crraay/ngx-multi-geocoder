import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { TabsModule } from "ngx-bootstrap/tabs";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { LeafletMapComponent } from "./components/leaflet-map/leaflet-map.component";
import { AigeoGeocoderService } from "./services/aigeo-geocoder.service";
import { GoogleGeocoderService } from "./services/google-geocoder.service";
import { YandexGeocoderService } from "./services/yandex-geocoder.service";
import { DataViewComponent } from './components/data-view/data-view.component';
import { AgmCoreModule } from "@agm/core";
import { env } from 'src/env/env';
import { GoogleMapComponent } from './components/google-map/google-map.component';

@NgModule({
    declarations: [
        RootComponent,
        LeafletMapComponent,
        DataViewComponent,
        GoogleMapComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        AgmCoreModule.forRoot({
            apiKey: env.GOOGLE_MAPS_API_KEY
        }),
        LeafletModule,
        TabsModule.forRoot(),
        BsDropdownModule.forRoot(),
    ],
    providers: [
        AigeoGeocoderService,
        GoogleGeocoderService,
        YandexGeocoderService
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
