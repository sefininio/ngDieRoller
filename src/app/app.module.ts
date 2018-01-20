import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppMaterialModule } from './app.material.module';

import { AppComponent } from './app.component';
import { RollerService } from './calculator/roller.service';
import { PresetsService } from './persistance/presets.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppMaterialModule,
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
