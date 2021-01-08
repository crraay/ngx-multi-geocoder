import { Component, Input, OnInit } from '@angular/core';
import { latLng, marker, tileLayer, Map, FeatureGroup, Marker } from "leaflet";

import { IGeoObject } from "../../interfaces/geo-object";
import { IDataSource } from "../../interfaces/data-source";

@Component({
    selector: 'leaflet-map',
    templateUrl: './leaflet-map.component.html',
    styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {
    // map instance
    private map: Map;
    // marker groups container
    private baseContainer: FeatureGroup = null;
    // associative array of markers for each datasource
    private markerGroups: { [key: string]: FeatureGroup } = {};
    // mapping for finding specific marker
    private markersMapping: { sourceId: string, data: IGeoObject, marker: Marker }[] = [];

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
        this.sources.forEach(source => {
            source.data.subscribe(data => {
                const group = this.getGroup(source.id);
                group.clearLayers();
                // clear previous entries
                this.markersMapping = this.markersMapping.filter(i => i.sourceId !== source.id);

                if (data) {
                    data.map((i: IGeoObject) => {
                        if (i.lat && i.long) {
                            const m = marker([i.lat, i.long])
                                .bindPopup(i.title)
                                .addTo(group);

                            this.markersMapping.push({
                                sourceId: source.id,
                                data: i,
                                marker: m
                            })
                        }
                    });

                    this.map.fitBounds(this.baseContainer.getBounds());
                }
            })
        })
    }

    getGroup(sourceId: string) {
        if (!this.markerGroups[sourceId]) {
            const group = new FeatureGroup();
            group.addTo(this.baseContainer);

            this.markerGroups[sourceId] = group;
        }

        return this.markerGroups[sourceId];
    }

    onItemExternalClick(item: IGeoObject) {
        const t = this.markersMapping.find(i => i.data === item);
        if (t) {
            this.map.setView(t.marker.getLatLng(), 10);
            t.marker.openPopup();
        }
    }

    onMapReady(map: Map) {
        this.map = map;
        this.baseContainer = new FeatureGroup();
        this.baseContainer.addTo(this.map);
    }
}
