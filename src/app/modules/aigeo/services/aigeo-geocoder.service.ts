import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class AigeoGeocoderService {
    readonly path = 'http://api.aigeo.ru/geocoder/service';

    constructor(
        private httpClient: HttpClient,
    ) { }

    search(query: string): Observable<any> {
        return this.httpClient
            .get(`${this.path}?format=json&search=${query}`)
            .pipe(switchMap((response: any) => {
                // TODO check status
                return of(response.response.results);
            }))
    }
}
