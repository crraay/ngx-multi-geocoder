import { Component, Input, OnInit } from '@angular/core';
import { latLng, marker, tileLayer, Map, FeatureGroup, Marker, Icon, IconOptions } from "leaflet";

import { IGeoObject } from "../../interfaces/geo-object";
import { IDataSource } from "../../interfaces/data-source";
import { debounceTime, filter } from "rxjs/operators";
import { merge } from "rxjs";


@Component({
    selector: 'leaflet-map',
    templateUrl: './leaflet-map.component.html',
    styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {
    // map instance
    private map: Map;
    // marker groups container
    private baseContainer: FeatureGroup = new FeatureGroup();
    // associative array of markers for each datasource
    private markerGroups: { [key: string]: FeatureGroup } = {};
    // mapping for finding specific marker
    private markersMapping: { sourceId: string, data: IGeoObject, marker: Marker }[] = [];

    @Input() sources: IDataSource[];

    readonly defaultIcon: Icon = new Icon<IconOptions>({
        iconSize: [ 24, 40 ],
        iconAnchor: [ 12, 40 ],
        popupAnchor: [ 0, -40 ],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
    });

    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 2,
        center: latLng(0, 0)
    };

    constructor() { }

    ngOnInit(): void {
        // TODO unsubscribe
        this.sources.forEach(source => {
            source.data$.subscribe((data: IGeoObject[]) => {
                this.clear(source.id);
                this.setMarkers(source.id, data);
            });

            source.enabled$
                .pipe(filter(value => !value))
                .subscribe(value => {
                    this.clear(source.id);
                })
        })

        const all = this.sources.map(i => i.data$);
        merge(...all).pipe(debounceTime(300))
            .subscribe(() => this.map.fitBounds(this.baseContainer.getBounds()));
    }

    clear(sourceId: string) {
        const group = this.getGroup(sourceId);
        group.clearLayers();
        // clear previous entries
        this.markersMapping = this.markersMapping.filter(i => i.sourceId !== sourceId);
    }

    setMarkers(sourceId: string, data: IGeoObject[]) {
        const group = this.getGroup(sourceId);

        data.forEach((i: IGeoObject) => {
            if (i.lat && i.long) {
                const m = marker(
                    [i.lat, i.long],
                    { icon: this.defaultIcon }
                )
                    .bindPopup(i.title)
                    .addTo(group);

                this.markersMapping.push({
                    sourceId: sourceId,
                    data: i,
                    marker: m
                })
            }
        });
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
        this.baseContainer.addTo(this.map);
    }
}
