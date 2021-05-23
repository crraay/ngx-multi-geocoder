import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IDataSource } from "../../interfaces/data-source";
import { IGeoObject } from "../../interfaces/geo-object";
import { filter } from "rxjs/operators";
import { AgmMap } from "@agm/core";

@Component({
    selector: 'google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
    // default
    lat = 56;
    lng = 93;

    @ViewChild(AgmMap) agmMap;

    @Input() sources: IDataSource[];

    markersMap: { [key: string]: any[] } = {};

    constructor() { }

    ngOnInit(): void {
        // TODO unsubscribe
        this.sources.forEach(source => {
            source.data$.subscribe((data: IGeoObject[]) => {
                this.markersMap[source.id] = data;
            });

            source.enabled$
                .pipe(filter(value => !value))
                .subscribe(value => {
                    delete this.markersMap[source.id];
                });
        })
    }
}
