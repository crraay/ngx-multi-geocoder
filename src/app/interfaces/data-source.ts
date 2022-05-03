import { Observable } from "rxjs";
import { IGeoObject } from "./geo-object";

export interface IDataSource {
    id: string;
    description?: string;

    loading$: Observable<boolean>;
    data$: Observable<IGeoObject[]>;

    enabled: boolean;
    enabled$: Observable<boolean>;
}
