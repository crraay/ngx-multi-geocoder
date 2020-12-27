import { Component, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { IGeoObject } from "../../interfaces/geo-object";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";
import { IDataView } from "../../interfaces/data-view";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    searchQuery = 'красноярск';
    @ViewChild('leafletMap') leafletMapComponent: LeafletMapComponent;

    sources: IDataView[] = null;

    constructor(
        private aigeoService: AigeoGeocoderService,
        private googleService: GoogleGeocoderService,
        private yandexService: YandexGeocoderService,
    ) {
        this.sources = [
            {
                id: 'google',
                title: 'Google data',
                source: null
            },
            {
                id: 'yandex',
                title: 'Yandex data',
                source: null
            },
            {
                id: 'aigeo',
                title: 'Aigeo data',
                subtitle: 'Only Krasnoyarsk\'s area searches allowed',
                source: null
            },
        ]
    }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        this.leafletMapComponent.reset();

        this.aigeoService.search(this.searchQuery)
            .subscribe((data: IGeoObject[]) => {
                console.log('aigeo data: ', data);

                this.setSourceData('aigeo', data);
                this.leafletMapComponent.append(data);
            });

        this.googleService.search(this.searchQuery)
            .subscribe((data:  IGeoObject[]) => {
                console.log('google data: ', data);

                this.setSourceData('google', data);
                this.leafletMapComponent.append(data);
            });

        this.yandexService.search(this.searchQuery)
            .subscribe((data: IGeoObject[]) => {
                console.log('yandex data: ', data);

                this.setSourceData('yandex', data);
                this.leafletMapComponent.append(data);
            });
    }

    onItemClick(item: IGeoObject) {
        this.leafletMapComponent.show(item);
    }

    setSourceData(id:string, data: IGeoObject[]) {
        var index = this.sources.findIndex(i => i.id === id);
        this.sources[index].source = data;
    }
}
