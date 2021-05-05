import { IDataSource } from "../interfaces/data-source";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";
import { debounceTime, filter, mergeMap, shareReplay, tap } from "rxjs/operators";

export class DataSource implements IDataSource {
    public id: string;
    public enabled: boolean;
    public description?: string;

    private searchSubject: Subject<string> = new Subject<string>();

    private dataSubject: Subject<IGeoObject[]> = new Subject<IGeoObject[]>();
    public data$: Observable<IGeoObject[]> = this.dataSubject.asObservable();

    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor(id: string, enabled: boolean, description: string = null, service: IGeocoderService) {
        this.id = id;
        this.enabled = enabled;
        if (description) this.description = description;

        const that = this;
        this.searchSubject.pipe(
            // TODO move to click handler
            debounceTime(500),
            tap((data) => that.dataSubject.next(null)),
            filter(() => that.enabled),
            tap((data) => that.loadingSubject.next(true)),
            mergeMap((query: string) => service.search(query)),
        ).subscribe(data => {
            this.dataSubject.next(data);
            this.loadingSubject.next(false);
        });
    }

    public search(text: string) {
        this.searchSubject.next(text);
    }
}
