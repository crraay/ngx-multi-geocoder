import { Component, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { IGeoObject } from "../../interfaces/geo-object";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    searchQuery = 'красноярск';
    @ViewChild('leafletMap') leafletMapComponent: LeafletMapComponent;

    // TODO turn into BehaviourSubject
    // TODO move to separate component
    aigeoData: IGeoObject[] = null;

    constructor(
        private aigeoService: AigeoGeocoderService,
        private googleService: GoogleGeocoderService,
        private yandexService: YandexGeocoderService,
    ) { }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        this.leafletMapComponent.reset();

        this.aigeoService.search(this.searchQuery)
            .subscribe((data: IGeoObject[]) => {
                console.log('aigeo data: ', data);
                this.aigeoData = data;
                this.leafletMapComponent.append(data);
            });

        this.googleService.search(this.searchQuery)
            .subscribe((data:  IGeoObject[]) => {
                console.log('google data: ', data);
            });

        this.yandexService.search(this.searchQuery)
            .subscribe((data: IGeoObject[]) => {
                console.log('yandex data: ', data);
            });
    }

    onItemClick(item: IGeoObject) {
        this.leafletMapComponent.show(item);
    }
}
