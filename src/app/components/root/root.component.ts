import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, of, Subject } from "rxjs";
import { shareReplay, switchMap } from "rxjs/operators";

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { IGeoObject } from "../../interfaces/geo-object";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";
import { IDataView } from "../../interfaces/data-view";
import { IGeocoderService } from "../../interfaces/geocoder-service";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    searchQuery = 'красноярск';

    // TODO remove
    @ViewChild('leafletMap') leafletMapComponent: LeafletMapComponent;

    data: IDataView[] = null;

    constructor(
        private aigeoService: AigeoGeocoderService,
        private googleService: GoogleGeocoderService,
        private yandexService: YandexGeocoderService,
    ) {
        this.data = [
            {
                id: 'google',
                title: 'Google data',
                source: this.createSubject(this.googleService)
            },
            {
                id: 'yandex',
                title: 'Yandex data',
                source: this.createSubject(this.yandexService)
            },
            {
                id: 'aigeo',
                title: 'Aigeo data',
                subtitle: 'Only Krasnoyarsk\'s area searches allowed',
                source: this.createSubject(this.aigeoService),
            },
        ];
    }

    // creates subject which can be run with searchString
    createSubject(service: IGeocoderService): Subject<IGeoObject[]> {
        // strict cast is necessary
        return <Subject<IGeoObject[]>>(new Subject<string>().pipe(
            switchMap(query => {
                // emits null value before API call
                return merge(
                    of(null),
                    service.search(query)
                );
            }),
            shareReplay(1)
        ));
    }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        this.data.forEach(source => {
            source.source.next(this.searchQuery);
        });
    }

    // TODO remove
    onItemClick(item: IGeoObject) {
        this.leafletMapComponent.show(item);
    }
}
