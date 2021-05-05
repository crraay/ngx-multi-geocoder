import { Observable, Subject } from "rxjs";
import { IGeoObject } from "./geo-object";

export interface IDataSource {
    id: string;
    description?: string;

    data: Observable<IGeoObject[]>;
    search(text: string);
}
