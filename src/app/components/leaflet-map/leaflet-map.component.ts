import { Component, OnInit } from '@angular/core';
import { latLng, marker, tileLayer, Map, FeatureGroup } from "leaflet";
import { IGeoObject } from "../../interfaces/geo-object";

@Component({
    selector: 'leaflet-map',
    templateUrl: './leaflet-map.component.html',
    styleUrls: ['./leaflet-map.component.scss']
})
export class LeafletMapComponent implements OnInit {
    private map: Map;
    private markers: FeatureGroup = null;

    options = {
        layers: [
            tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
        ],
        zoom: 2,
        center: latLng(0, 0)
    };

    constructor() { }

    ngOnInit(): void { }

    reset() {
        this.markers.clearLayers();
    }

    append(data: IGeoObject[]) {
        data.map((i: IGeoObject) => {
            if (i.lat && i.long) {
                marker([i.lat, i.long]).addTo(this.markers)
            }
        });

        const bounds = this.markers.getBounds();
        this.map.fitBounds(bounds);
    }

    show(item: IGeoObject) {
        this.map.setView([item.lat, item.long], 10);
    }

    onMapReady(map: Map) {
        this.map = map;
        this.markers = new FeatureGroup();
        this.markers.addTo(this.map);
    }
}
