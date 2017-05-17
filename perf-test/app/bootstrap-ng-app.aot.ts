import { start } from "tns-core-modules/profiling";
start("bootstrap-ng-app");

// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScript } from "nativescript-angular/platform-static";

import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import { APP_ROOT_VIEW } from "nativescript-angular/platform-providers";
import { AppModuleNgFactory } from "./app.module.ngfactory";
import { topmost } from "tns-core-modules/ui/frame"

const rootPage = topmost().currentPage;
const rootViewProvider = { provide: APP_ROOT_VIEW, useValue: rootPage };
const platform = platformNativeScript({ bootInExistingPage: true }, [rootViewProvider]);

platform.bootstrapModuleFactory(AppModuleNgFactory);