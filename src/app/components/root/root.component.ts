import { Component, OnInit } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
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

    sourcesEnableMapping: { enabled: boolean, source: IDataSource }[];

    get sources(): IDataSource[] {
        return this.sourcesEnableMapping
            .map(i => i.source);
    }

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
        this.sourcesEnableMapping = [
            {
                enabled: true,
                source: new DataSource('Google', null, this.googleService),
            },
            {
                enabled: true,
                source: new DataSource('Yandex', null, this.yandexService),
            },
            {
                enabled: false,
                source: new DataSource('Aigeo',  'Only Krasnoyarsk\'s area searches allowed', this.aigeoService),
            },
        ]
    }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        // emits search event for all sources
        // if source disabled emits null value
        this.sourcesEnableMapping
            .forEach(i => i.source.search(i.enabled ? this.searchQuery : null));
    }
}
