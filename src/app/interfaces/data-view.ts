import { Subject } from "rxjs";

export interface IDataView {
    id: string;
    title: string;
    subtitle?: string;
    source: Subject<any>;
}
