import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { FoursquareService } from '../services/foursquare.service';
import { WindowRef } from '../services/win-ref.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Interest Map';
  zoom = 15
  center: google.maps.LatLngLiteral = { // Default to Ming's Home location
    lat: 43.4700288,
    lng: -80.57978880000002
  }
  markers = [];
  fsService: FoursquareService;

  @ViewChild("gmapView") gmap: GoogleMap;


  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 17,
    minZoom: 13,
    disableDefaultUI: true,
  }
  constructor(_fsService: FoursquareService) {
    this.fsService = _fsService
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position)=>{
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;

      this.center = {
        lat: latitude,
        lng: longitude,
      }
    });
  };

  ngAfterViewInit(){
    this.getNewData()
    console.log(this.gmap)
  }

  lockStartDate = new Date(0);

  private async getNewData() {
    try {

      if (new Date().getTime() - this.lockStartDate.getTime() < 2000) { // To limit the amount of API call to foursquare on free tier plan.
        return setTimeout(() => { 
          this.getNewData()
        }, 1000)
      }

      this.lockStartDate = new Date()
      const currentCenter = {
        lat: this.gmap.getCenter().lat(),
        lng: this.gmap.getCenter().lng(),
      }
      const res = await this.fsService.getInterestXHR(currentCenter);


      const venues = res["response"].groups[0].items
      const venueListLength = venues.length;
      this.markers = []
      this.markers = venues.map((elem, index) => {
            const newMarker = {
              position: {
                lat: elem.venue.location.lat,
                lng: elem.venue.location.lng,
              },
              label: {
                color: 'red',
                text: ' '
              },
              title: elem.venue.name,
              options: { animation: google.maps.Animation.DROP },
              zIndex: venueListLength - index 
            }
            return newMarker;
      });
      this.lockStartDate = new Date(0);
    } catch (err) {
      console.log(err);
      this.lockStartDate = new Date(0);
    }

      
  }

  mouseDragStartEvt(evt) {
    console.log("Drag start, cancel all existing data resolve.")
    console.log(evt)
  }

  mouseDragEndEvt($event) {
    console.log("drag end, find interest based on current center point location.")
    this.getNewData()
  }

  mapCenterChangedEvt(evt) { // not used, as it doesn't help with deacceleration end.
    console.log("CENTER CHANGE")
    console.log(evt)
  }
}
