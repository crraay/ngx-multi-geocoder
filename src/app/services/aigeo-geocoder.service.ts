import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { IGeoObject } from "../interfaces/geo-object";

@Injectable({
    providedIn: 'root'
})
export class AigeoGeocoderService {
    readonly path = 'http://api.aigeo.ru/geocoder/service';

    constructor(
        private httpClient: HttpClient,
    ) { }

    search(query: string): Observable<IGeoObject[]> {
        return this.httpClient
            .get(`${this.path}?format=json&search=${query}`)
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
