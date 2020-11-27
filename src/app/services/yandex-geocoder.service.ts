import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { env } from "../../env/env";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";

@Injectable({
    providedIn: 'root'
})
export class YandexGeocoderService implements IGeocoderService {
    private readonly path = 'https://geocode-maps.yandex.ru/1.x/';

    constructor(
        private httpClient: HttpClient,
    ) { }

    search(query: string): Observable<IGeoObject[]> {
        const url = `${this.path}?format=json&apikey=${env.YANDEX_API_KEY}&geocode=${query}`;

        return this.httpClient.get(url)
            .pipe(switchMap((response: any) => {
                const featureMember = response.response.GeoObjectCollection.featureMember;
                const result = featureMember.map(i => {
                    return <IGeoObject>{
                        title: i.GeoObject.metaDataProperty.GeocoderMetaData.text, // + description
                        lat: i.GeoObject.Point.pos.split(' ')[1],
                        long: i.GeoObject.Point.pos.split(' ')[0],
                    }
                })

                return of(result);
            }));
    }
}
