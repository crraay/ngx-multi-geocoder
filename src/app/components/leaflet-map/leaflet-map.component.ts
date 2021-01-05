import { Component, Input, OnInit } from '@angular/core';
import { latLng, marker, tileLayer, Map, FeatureGroup } from "leaflet";

import { IGeoObject } from "../../interfaces/geo-object";
import { IDataSource } from "../../interfaces/data-source";

@Component({
    selector: 'leaflet-map',
    templateUrl: './leaflet-map.component.html',
    styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {
    private map: Map;
    // markers layer
    private markers: FeatureGroup = null;
    // associative array of markers for each datasource
    private groups: { [key: string]: FeatureGroup } = {};

    @Input() sources: IDataSource[];

    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 2,
        center: latLng(0, 0)
    };

    constructor() { }

    ngOnInit(): void {
        this.sources.forEach(i => {
            i.data.subscribe(data => {
                const group = this.getGroup(i.id);
                group.clearLayers();

                if (data) {
                    data.map((i: IGeoObject) => {
                        if (i.lat && i.long) {
                            marker([i.lat, i.long]).addTo(group)
                        }
                    });

                    this.map.fitBounds(this.markers.getBounds());
                }
            })
        })
    }

    getGroup(id: string) {
        if (!this.groups[id]) {
            const group = new FeatureGroup();
            group.addTo(this.markers);

            this.groups[id] = group;
        }

        return this.groups[id];
    }

    // TODO  remove
    show(item: IGeoObject) {
        this.map.setView([item.lat, item.long], 10);
    }

    onMapReady(map: Map) {
        this.map = map;
        this.markers = new FeatureGroup();
        this.markers.addTo(this.map);
    }
}
