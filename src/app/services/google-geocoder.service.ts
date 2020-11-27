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
export class GoogleGeocoderService implements IGeocoderService {
    private readonly path = 'https://maps.googleapis.com/maps/api/geocode/json';

    constructor(
        private httpClient: HttpClient,
    ) { }

    search(query: string): Observable<IGeoObject[]> {
        const url = `${this.path}?key=${env.GOOGLE_API_KEY}&address=${query}`;

        return this.httpClient.get(url)
            .pipe(switchMap((response: any) => {
                const result = response.results
                    .map(i => {
                        return <IGeoObject>{
                            title: i.formatted_address,
                            lat: i.geometry.location.lat,
                            long: i.geometry.location.lng,
                        }
                    });

                return of(result);
            }));
    }
}
