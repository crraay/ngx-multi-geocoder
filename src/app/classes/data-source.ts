import { IDataSource } from "../interfaces/data-source";
import { merge, Observable, of, Subject } from "rxjs";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";
import { debounceTime, mergeMap, shareReplay } from "rxjs/operators";

export class DataSource implements IDataSource {
    public id: string;
    public description?: string;

    private searchSubject: Subject<string>;
    public data: Observable<IGeoObject[]>;

    constructor(id: string, description: string = null, service: IGeocoderService) {
        this.id = id;
        if (description) this.description = description;

        this.searchSubject = new Subject<string>();

        this.data = this.searchSubject.pipe(
            debounceTime(500),
            mergeMap((query: string) => {
                // if null query passed returns null
                // else emits null value before API call
                return !query ?
                    of(null) :
                    merge(of(null), service.search(query));
            }),
            shareReplay(1)
        );
    }

    public search(text: string) {
        this.searchSubject.next(text);
    }
}
