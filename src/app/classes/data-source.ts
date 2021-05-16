import { IDataSource } from "../interfaces/data-source";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";
import { filter, mergeMap, shareReplay, tap } from "rxjs/operators";

export class DataSource implements IDataSource {
    public readonly id: string;
    public readonly description?: string;

    private readonly searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public readonly data$: Observable<IGeoObject[]>;

    private readonly loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private readonly enabledSubject: BehaviorSubject<boolean>;
    public readonly enabled$: Observable<boolean>;

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

        this.data$ = combineLatest([
            this.searchSubject.asObservable(),
            this.enabled$
        ])
            .pipe(
                filter(([query, enabled]) => query !== null),
                filter(([query, enabled]) => enabled),
                tap(() => this.loadingSubject.next(true)),
                mergeMap(([query, enabled]) => service.search(query)),
                tap(() => this.loadingSubject.next(false)),
                shareReplay(1),
            )
    }

    public search(text: string) {
        this.searchSubject.next(text);
    }
}
