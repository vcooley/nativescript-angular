import { Component, Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'flexbox-item',
    templateUrl: './flexbox-item.component.html'
})
export class FlexboxItemComponent {
    @Input() item: any;
    constructor() {
    }
}