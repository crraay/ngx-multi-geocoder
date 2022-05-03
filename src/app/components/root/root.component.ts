import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";
import { IDataSource } from "../../interfaces/data-source";
import { DataSource } from "../../classes/data-source";
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;

    defaultSearchQuery = 'красноярск';

    sources: IDataSource[];

    get enabledSources(): IDataSource[] {
        return this.sources
            .filter(i => i.enabled);
    }

    constructor(
        private aigeoService: AigeoGeocoderService,
        private googleService: GoogleGeocoderService,
        private yandexService: YandexGeocoderService,
    ) { }

    ngOnInit(): void {
        setTimeout(() => {
            const query$ = fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                debounceTime(500),
                map(event => (<HTMLTextAreaElement>event.target).value),
                distinctUntilChanged()
            );

            this.sources = [
                new DataSource('Google', this.googleService, query$, true),
                new DataSource('Yandex', this.yandexService, query$, true),
                // new DataSource('Aigeo', false, 'Only Krasnoyarsk\'s area searches allowed', this.aigeoService),
            ];
        });
    }
}
