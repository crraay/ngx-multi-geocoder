import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IGeoObject } from "../../interfaces/geo-object";
import { IDataSource } from "../../interfaces/data-source";

@Component({
    selector: 'app-data-card',
    templateUrl: './data-view.component.html',
    styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {
    @Input() source: IDataSource = null;
    @Output() clicked = new EventEmitter<IGeoObject>();

    constructor() { }

    ngOnInit(): void {
    }
}
