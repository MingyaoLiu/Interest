import { Component, ViewChild, ElementRef, AfterViewInit, ViewRef } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ListPanelComponent } from '../list-panel/list-panel.component';
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
  listData = [];
  fsService: FoursquareService;
  lockStartDate = undefined;
  selectedIndex = -1;

  @ViewChild("gmapView") gmap: GoogleMap;

  @ViewChild("listPanel") listView: ListPanelComponent;

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
    navigator.geolocation.getCurrentPosition((position) => {
      const longitude = position.coords.longitude;
      const latitude = position.coords.latitude;
      this.center = {
        lat: latitude,
        lng: longitude,
      }
      this.getNewData()
    });
  };

  ngAfterViewInit() {
    this.getNewData()
  }


  private getRoughRadius = (viewBound: google.maps.LatLngBounds) => { // Very inaccurate distance calc.
    return Math.abs(viewBound['Ya'].i - viewBound['Ya'].j) * 40000000 / 960
  }

  private async getNewData() {
    try {

      if (this.lockStartDate && (new Date().getTime() - this.lockStartDate.getTime() < 2000)) { // To limit the amount of API call to foursquare on free tier plan.
        return;
      }

      this.lockStartDate = new Date()
      const currentCenter = {
        lat: this.gmap.getCenter().lat(),
        lng: this.gmap.getCenter().lng(),
      }
      let currentRad = 1000
      try {
        currentRad = this.getRoughRadius(this.gmap.getBounds())
      } catch (err) {
        console.log(err)
      }
      const res = await this.fsService.getInterestXHR(currentCenter, currentRad);

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
          options: {
            animation: google.maps.Animation.DROP,
            opacity: 1
          },
          zIndex: venueListLength - index
        }
        return newMarker;
      });
      this.listData = venues.map((elem, index) => {
        const newDataPoint = {
          title: elem.venue.name,
          desc: elem.venue.location.address
        }
        return newDataPoint;
      })
      this.selectedIndex = -1
      this.listView.currentSelectedIndex = -1
      this.lockStartDate = undefined;


    } catch (err) {
      console.log(err);
      this.selectedIndex = -1
      this.listView.currentSelectedIndex = -1
      this.lockStartDate = undefined;
    }
  }


  highlightInterest(index) {
    this.markers.forEach((elem, index2) => {
      if (index2 === index) {
        elem.options = {
          animation: google.maps.Animation.BOUNCE,
          opacity: 1
        };
      } else {
        elem.options = {
          animation: 0,
          opacity: 0.3
        };
      }
    })
  }

  mouseDragStartEvt(evt) {
  }

  mouseDragEndEvt($event) {
    this.getNewData()
  }

  mapCenterChangedEvt(evt) { // not used, as it doesn't help with deacceleration end.
  }
}
