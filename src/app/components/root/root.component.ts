import { Component, OnInit, ViewChild } from '@angular/core';

import { AigeoGeocoderService } from "../../services/aigeo-geocoder.service";
import { IGeoObject } from "../../interfaces/geo-object";
import { LeafletMapComponent } from "../leaflet-map/leaflet-map.component";


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
    ) { }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        this.leafletMapComponent.reset();

        this.aigeoService.search(this.searchQuery)
            .subscribe((data: IGeoObject[]) => {
                this.aigeoData = data;
                this.leafletMapComponent.append(data);
            });
    }

    onItemClick(item: IGeoObject) {
        this.leafletMapComponent.show(item);
    }
}
