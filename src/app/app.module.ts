import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RollerService } from './calculator/roller.service';
import { PresetsService } from './persistance/presets.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    RollerService,
    PresetsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
