import { Component, NgModule } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {
  title = 'mobile-app';
  public actualTemp = '';
  public address : any;
  public coordinates: any;
  public cities : any;
  myControl = new FormControl();

  public options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '92260cdb1fmsh7712a2c66372213p1f4f05jsn5ddc26d41e38',
      'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
    }
  };


  constructor( private http: HttpClient) { }

  async ngOnInit (){ 
    this.coordinates = await Geolocation.getCurrentPosition();
    this.getCurrentAdress(this.coordinates.coords.latitude, this.coordinates.coords.longitude).subscribe(data => {

      this.address = data.results[0];
      this.address.address = this.address.address.split(',');
    });

    this.getCompleteCity('renn').subscribe(data => {
      this.cities = data.results;
    })

    this.myControl.valueChanges.subscribe(x => {
      this.getCompleteCity(x).subscribe(cities => {
        this.cities = cities.results;
      })
    })

    this.getCurrentWeather(this.coordinates.coords.latitude, this.coordinates.coords.longitude).subscribe(data => {

      this.actualTemp = data.current_weather.temperature;
    });

  }

  getCurrentWeather(latitude: number, longitude: number): Observable<any> {
    return this.http.get("https://api.open-meteo.com/v1/forecast?latitude="+ latitude +"&longitude="+ longitude + "&current_weather=true" );
  }

  getCurrentAdress(latitude: number, longitude: number): Observable<any> {
    return this.http.get('https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location='+ latitude + '%2C' + longitude + '&language=en', this.options);
  }

  getCompleteCity(nom: string): Observable<any> {
    return this.http.get('https://geocoding-api.open-meteo.com/v1/search?name=' + nom);
  }

  changeCity(city: any): void {
    // A FAIRE
}
