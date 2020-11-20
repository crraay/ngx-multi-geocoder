import { Component, OnInit } from '@angular/core';

import { AigeoGeocoderService } from "../../modules/aigeo/services/aigeo-geocoder.service";


@Component({
    selector: 'app-root',
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
    searchQuery = 'Москва';

    // TODO turn into BehaviourSubject
    // TODO move to separate component
    aigeoData = null;

    constructor(
        private aigeoService: AigeoGeocoderService,
    ) { }

    ngOnInit(): void {
    }

    onSearchBtnClick() {
        this.aigeoService.search(this.searchQuery)
            .subscribe(data => {
                this.aigeoData = data;
            });
    }

}
