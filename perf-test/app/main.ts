import { enable } from "tns-core-modules/profiling";
enable();

import * as application from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page";
import { Button } from "tns-core-modules/ui/button";

application.start({
    create: (): Page => {
        const page = new Page();
        const startBtn = new Button();
        startBtn.text = "start";
        startBtn.on("tap", () => {
            require("./bootstrap-ng-app");
        })

        page.content = startBtn;
        return page;
    }
});