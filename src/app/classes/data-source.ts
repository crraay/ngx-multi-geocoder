import { IDataSource } from "../interfaces/data-source";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";
import { filter, mergeMap, tap } from "rxjs/operators";

export class DataSource implements IDataSource {
    public id: string;
    public description?: string;

    private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private dataSubject: Subject<IGeoObject[]> = new Subject<IGeoObject[]>();
    public data$: Observable<IGeoObject[]> = this.dataSubject.asObservable();

    private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private enabledSubject: BehaviorSubject<boolean>;
    public enabled$: Observable<boolean>;
    set enabled(value: boolean) {
        this.enabledSubject.next(value);
    }
    get enabled(): boolean {
        return this.enabledSubject.getValue();
    }

    constructor(
        id: string,
        enabled: boolean,
        description: string = null,
        service: IGeocoderService
    ) {
        this.id = id;
        if (description) this.description = description;

        // init here because we need init value
        this.enabledSubject = new BehaviorSubject<boolean>(enabled);
        this.enabled$ = this.enabledSubject.asObservable();

        combineLatest([
            this.searchSubject.asObservable(),
            this.enabled$
        ])
            .pipe(
                filter(([query, enabled]) => query !== null),
                // TODO not sure we need it here
                tap(() => this.dataSubject.next(null)),
                filter(([query, enabled]) => enabled),
                tap(() => this.loadingSubject.next(true)),
                mergeMap(([query, enabled]) => service.search(query)),
            )
            .subscribe((data: IGeoObject[]) => {
                this.dataSubject.next(data);
                this.loadingSubject.next(false);
            });
    }

    public search(text: string) {
        this.searchSubject.next(text);
    }
}
