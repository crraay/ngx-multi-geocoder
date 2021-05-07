import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { GoogleGeocoderService } from "../../services/google-geocoder.service";
import { YandexGeocoderService } from "../../services/yandex-geocoder.service";
import { IDataSource } from "../../interfaces/data-source";
import { DataSource } from "../../classes/data-source";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, AfterViewInit {
    @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
    @ViewChild('searchButton') searchButton: ElementRef<HTMLButtonElement>;

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
    ) {
        this.sources = [
            new DataSource('Google', true,null, this.googleService),
            new DataSource('Yandex', true,null, this.yandexService),
            new DataSource('Aigeo', false, 'Only Krasnoyarsk\'s area searches allowed', this.aigeoService),
        ];
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        const input = this.searchInput;

        // search button click event handler
        fromEvent(this.searchButton.nativeElement, 'click')
            .pipe(debounceTime(500))
            .subscribe(event => {
                const searchQuery = input.nativeElement.value;
                // emit search event for all sources
                this.sources.forEach(i => i.search(searchQuery));
            });
    }
}
