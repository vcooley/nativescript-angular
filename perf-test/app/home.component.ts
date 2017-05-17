import { Component, AfterViewChecked } from "@angular/core";
import { stop } from "tns-core-modules/profiling";

@Component({
    moduleId: module.id,
    selector: "ns-home",
    templateUrl: "./home.component.html",
})
export class HomeComponent implements AfterViewChecked {
    isLoaded = false;
    ngAfterViewChecked() {
        if (!this.isLoaded) {
            stop("bootstrap-ng-app");
            this.isLoaded = true;
        }
    }
}
