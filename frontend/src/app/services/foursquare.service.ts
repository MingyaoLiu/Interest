import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, from } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FoursquareService {

  constructor(private httpClient: HttpClient) { }
  
  /**
   * Get all Purchase.
   *
   *
   * @returns Observable<object>
   *
   */
  public getInterestNearLocation(loc: google.maps.LatLngLiteral): Observable<object> {
    const apiUrl = 'https://api.foursquare.com/v2/venues/search';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams()
      .set('client_id',environment.fs_c_id)
      .set('client_secret', environment.fs_c_scrt)
      .set('v', '20190425')
      .set('ll',  loc.lat + ',' + loc.lng)
      .set('radius', '1000')
      .set('intent','browse')
      .set('limit', '10')
    };

    return this.httpClient.get(apiUrl, httpOptions).pipe(map(this.extractData));
  }

  private commonAPIResolver = (config) => {
    return new Promise(function (resolve, reject) {
  
      if (config.beforeSend && config.beforeSend instanceof Function) {
        config.beforeSend();
      }
  
      let xhr = new XMLHttpRequest();
  
      xhr.responseType = 'json';
  
      xhr.addEventListener("readystatechange", function () {
        switch (xhr.readyState) {
          case 1:
            break;
          case 4: {
            const statusCode = xhr.status;
            if (statusCode >= 100 && statusCode < 200) {
              return reject("Client Error");
            }
            else if (statusCode >= 200 && statusCode < 300) {
              return resolve(xhr.response);
            }
            else if (statusCode >= 300 && statusCode < 400) {
              return reject("Redirect");
            }
            else if (statusCode >= 400 && statusCode < 500) {
              if (statusCode === 401 || statusCode === 403) {
                return reject("Your session has expired.Please log in again.Redirecting...");
              }
              return reject(xhr.response);
            }
            else if (statusCode >= 500 && statusCode < 600) {
              return reject(xhr.response);
            }
            else {
              return reject("Server response status invalid.");
            }
          }
        }
      });
  
      xhr.open(config.type, config.url, config.async || true);
      config.headers.forEach(function (eachHeader) {
        xhr.setRequestHeader(eachHeader.name, eachHeader.value);
      });
      xhr.send(
        typeof config.data === "object" ? JSON.stringify(config.data) : config.data
      );
    });
  
  };
  
  public async getXHRWithResolver(loc: google.maps.LatLngLiteral) {
    return new Promise(async (resolve, reject) => {
      let httpConfig = {
        'type': 'POST',
        'url': 'https://api.foursquare.com/v2/venues/search',
        'async': true,
        'headers': [{
          'name': 'Content-Type',
          'value': 'application/json'
        }],
        params: new HttpParams()
        .set('client_id',environment.fs_c_id)
        .set('client_secret', environment.fs_c_scrt)
        .set('v', '20190425')
        .set('ll',  loc.lat + ',' + loc.lng)
        .set('radius', '1000')
        .set('intent','browse')
        .set('limit', '10'),
      };
      const httpResolveData = await this.commonAPIResolver(httpConfig);
      return httpResolveData;
    })
  }

  public async getInterestXHR(loc: google.maps.LatLngLiteral) {
    return new Promise(async (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = false; 
      xhr.addEventListener("readystatechange", function() {
        const statusCode = xhr.status;
        console.log(statusCode)
        if(this.readyState === 4) {
          if (statusCode >= 200 && statusCode < 300) {
            return resolve(JSON.parse(this.responseText));
          } else {
            return reject("Error in XHR request")
          }
        }
      });
      xhr.open("GET", "https://api.foursquare.com/v2/venues/explore?intent=browse&limit=30&client_id=VIL0PPC5YZTJUU0TWN5WJEBWNAKISARNPKDEIBOAFBIRODWA&client_secret=UBI3KWU0NVJK0MJJF5LPLIFUZJ5ZZBJQLSAV1GTZGPITFZZN&v=20190425&radius=1000&ll=" + loc.lat + ',' + loc.lng);
      xhr.send();
    })
  }


  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}

