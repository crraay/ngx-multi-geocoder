import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";

import { AigeoGeocoderService } from "./services/aigeo-geocoder.service";


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        AigeoGeocoderService,
    ]
})
export class AigeoModule { }
