import { Component } from '@angular/core';
import { GC } from "tns-core-modules/utils/utils";
import { dumpProfiles, resetProfiles } from "tns-core-modules/profiling";

const titles = ["Etiam lacinia", "Imperdiet ante", "A interdum", "Quisque tempus", "Sodales viverra"];
const bodies = [
  "Vivamus ipsum neque, commodo rutrum finibus sit amet, cursus id sapien.",
  "Duis et iaculis odio. Class aptent taciti.",
  "Sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  "Etiam vitae lacinia purus. Vestibulum laoreet nibh a porta aliquet.",
  "Vivamus ut eros vitae felis volutpat aliquet.",
  "Aliquam fermentum mauris consequat hendrerit elementum.",
  "Nam odio tortor, malesuada congue diam volutpat, placerat ullamcorper risus.",
  "Curabitur eget nunc viverra justo bibendum rutrum ut nec lectus.",
  "Pellentesque et lacus vel turpis suscipit posuere sed non sapien.",
  "Integer eget ornare nunc. In lacinia congue sollicitudin.",
  "Quisque lobortis quam in risus porttitor, ac laoreet lacus auctor."
];

const items = [];
for (var i = 0; i < 64; i++) {
  items.push({
    icon: "~/icons/icon" + (1 + (i % 3)) + ".jpg",
    title: titles[i % titles.length],
    body: bodies[i % bodies.length],
    up: (i * 991) % 100,
    down: (i * 997) % 100
  });
}


@Component({
  moduleId: module.id,
  selector: 'renderer-test',
  templateUrl: './renderer-test.component.html'
})
export class RendererTestComponent {
  items: any[];
  title: string = "---";
  constructor() {

  }

  clear() {
    this.items = [];
    this.title = "---";
    GC();
  }

  generate() {
    this.clear();
    setTimeout(() => {
        let start = Date.now();
        this.items = items;
        setTimeout(() => {
            let end = Date.now();
            this.title = "Time: " + (end - start).toString();
            console.log("Duration: " + (end - start));
        });
    });
  }

  dump(){
    dumpProfiles();
  }

  reset(){
    resetProfiles()
  }
}