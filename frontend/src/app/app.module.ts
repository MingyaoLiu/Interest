import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component/app.component';
import { environment } from '../environments/environment'
import { WindowRef } from './services/win-ref.service';

import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { ListPanelComponent } from './list-panel/list-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    AppComponent,
    ListPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatProgressBarModule,
    MatCardModule,
    MatPaginatorModule,
    ScrollingModule,
  ],

  providers: [WindowRef],
  bootstrap: [AppComponent]
})
export class AppModule {

  //   constructor(protected _winRef: WindowRef) {
  //     this.appendGoogleMapsJSLib()
  //   }

  //   private appendGoogleMapsJSLib() {
  //     try {
  //         const gmapScript = document.createElement('script');
  //         gmapScript.src = 'https://maps.googleapis.com/maps/api/js?key='+ environment.g_map +'&callback=initMap';
  //         const win = new WindowRef();
  //         win.nativeWindow.initMap = function() {
  //           console.log("GOOGLE MAP LOADED")
  //           // JS API is loaded and available
  //         };
  //         document.head.appendChild(gmapScript);
  //     } catch (err) {
  //         console.error('Error appending and loading google maps');
  //         console.error(err);
  //     }
  // }

}
