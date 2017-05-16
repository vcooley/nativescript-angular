// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { enable } from "tns-core-modules/profiling";
enable();

import { platformNativeScriptDynamic } from "nativescript-angular/platform";

import { AppModule } from "./app.module";

platformNativeScriptDynamic().bootstrapModule(AppModule);
