import { Observable, Subject } from "rxjs";
import { IGeoObject } from "./geo-object";

export interface IDataSource {
    id: string;
    description?: string;
    // enabled: boolean;

    searchSubject: Subject<string>;
    data: Observable<IGeoObject[]>;
}
