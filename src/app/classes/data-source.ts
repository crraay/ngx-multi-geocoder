import { IDataSource } from "../interfaces/data-source";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { IGeoObject } from "../interfaces/geo-object";
import { IGeocoderService } from "../interfaces/geocoder-service";
import { filter, shareReplay, tap, switchMap } from 'rxjs/operators';

export class DataSource implements IDataSource {
    public readonly id: string;
    public readonly description?: string;

    public readonly data$: Observable<IGeoObject[]>;

    private readonly loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    private readonly enabledSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public readonly enabled$: Observable<boolean> = this.enabledSubject.asObservable();

    set enabled(value: boolean) {
        this.enabledSubject.next(value);
    }
    get enabled(): boolean {
        return this.enabledSubject.getValue();
    }

    constructor(
        id: string,
        service: IGeocoderService,
        query$: Observable<string>,
        enabled: boolean,
        description: string = null,
    ) {
        this.id = id;
        this.enabled = enabled;
        if (description) this.description = description;

        this.data$ = combineLatest([query$, this.enabled$])
            .pipe(
                filter(([query, enabled]) => query !== null),
                filter(([query, enabled]) => enabled),
                tap(() => this.loadingSubject.next(true)),
                switchMap(([query, enabled]) => service.search(query)),
                tap(() => this.loadingSubject.next(false)),
                shareReplay(1),
            );
    }
}
