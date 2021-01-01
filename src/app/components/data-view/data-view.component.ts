import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IGeoObject } from "../../interfaces/geo-object";
import { IDataView } from "../../interfaces/data-view";

@Component({
    selector: 'app-data-card',
    templateUrl: './data-view.component.html',
    styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {
    @Input() data: IDataView = null;
    @Output() clicked = new EventEmitter<IGeoObject>();

    constructor() { }

    ngOnInit(): void {
    }
}
