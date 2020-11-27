import { Observable } from "rxjs";
import { IGeoObject } from "./geo-object";

export interface IGeocoderService {
    search(query: string): Observable<IGeoObject[]>;
}
