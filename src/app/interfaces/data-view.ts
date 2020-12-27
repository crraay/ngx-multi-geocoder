import { IGeoObject } from "./geo-object";

export interface IDataView {
    id: string;
    title: string;
    subtitle?: string;
    source: IGeoObject[];
}
