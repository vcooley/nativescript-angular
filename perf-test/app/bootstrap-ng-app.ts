import { start } from "tns-core-modules/profiling";
start("bootstrap-ng-app");

// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { APP_ROOT_VIEW } from "nativescript-angular/platform-providers";
import { AppModule } from "./app.module";
import { topmost } from "tns-core-modules/ui/frame"

const rootPage = topmost().currentPage;
const rootViewProvider = { provide: APP_ROOT_VIEW, useValue: rootPage };
const platform = platformNativeScriptDynamic({ bootInExistingPage: true }, [rootViewProvider]);

platform.bootstrapModule(AppModule);