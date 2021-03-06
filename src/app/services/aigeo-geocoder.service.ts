import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";

@Injectable({
    providedIn: 'root'
})
export class AigeoGeocoderService implements IGeocoderService {
    private readonly path = 'http://api.aigeo.ru/geocoder/service';

    constructor(
        private httpClient: HttpClient,
    ) { }

    search(query: string): Observable<IGeoObject[]> {
        const url = `${this.path}?format=json&search=${query}`;

        return this.httpClient
            .get(url)
            .pipe(switchMap((response: any) => {
                // TODO check status
                const result = response.response.results
                    .map(i => {
                        return <IGeoObject>{
                            title: i.fulladdressstring,
                            lat: i.geoData ? i.geoData.latitude : null,
                            long: i.geoData ? i.geoData.longitude : null,
                        }
                    });

                return of(result);
            }))
    }
}
