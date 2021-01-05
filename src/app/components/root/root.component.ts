import { Component, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { IGeoObject } from "../../interfaces/geo-object";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";
import { IDataSource } from "../../interfaces/data-source";
import { DataSource } from "../../classes/data-source";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    searchQuery = 'красноярск';

    // TODO remove
    @ViewChild('leafletMap') leafletMapComponent: LeafletMapComponent;

    sources: IDataSource[] = null;
    sourcesEnableMapping: { enabled: boolean, source: IDataSource }[] = null;

    get enabledSources(): IDataSource[] {
        return this.sourcesEnableMapping
            .filter(i => i.enabled)
            .map(i => i.source);
    }

    constructor(
        private aigeoService: AigeoGeocoderService,
        private googleService: GoogleGeocoderService,
        private yandexService: YandexGeocoderService,
    ) {
        this.sources = [
            new DataSource('Google', null, this.googleService),
            new DataSource('Yandex', null, this.yandexService),
            new DataSource('Aigeo',  'Only Krasnoyarsk\'s area searches allowed', this.aigeoService),
        ];

        this.sourcesEnableMapping = [
            {
                enabled: true,
                source: this.sources[0],
            },
            {
                enabled: true,
                source: this.sources[1],
            },
            {
                enabled: false,
                source: this.sources[2],
            },
        ]
    }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        // emits search event for all sources
        // if source disabled emits null value
        this.sourcesEnableMapping
            .forEach(i => i.source.searchSubject.next(i.enabled ? this.searchQuery : null));
    }

    // TODO remove
    onItemClick(item: IGeoObject) {
        this.leafletMapComponent.show(item);
    }
}
