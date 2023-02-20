import { Component, NgModule } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { exit } from 'process';


@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})

export class HomeComponent {
  title = 'mobile-app';
  public actualTemp = '';
  public address: any;
  public coordinates: any;
  public cities: any;
  public actualCity: any;
  myControl = new FormControl();
  public saveCities: any[] = JSON.parse(localStorage.getItem('saveCities') as any) || [];

  public options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '92260cdb1fmsh7712a2c66372213p1f4f05jsn5ddc26d41e38',
      'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com'
    }
  };


  constructor(private http: HttpClient) { }

  async ngOnInit() {



    this.coordinates = await Geolocation.getCurrentPosition();
    this.getCurrentAdress(this.coordinates.coords.latitude, this.coordinates.coords.longitude).subscribe(data => {

      this.address = data.results[0];
      this.address.address = this.address.address.split(',');
    });


    this.myControl.valueChanges.subscribe(x => {
      this.getCompleteCity(x).subscribe(cities => {
        this.cities = cities.results;
      })
    })

    this.getCurrentWeather(this.coordinates.coords.latitude, this.coordinates.coords.longitude).subscribe(data => {

      this.actualTemp = data.current_weather.temperature;
    });

    this.updateSaveCities();

  }

  getCurrentWeather(latitude: number, longitude: number): Observable<any> {

    return this.http.get("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current_weather=true");
  }

  getCurrentAdress(latitude: number, longitude: number): Observable<any> {
    return this.http.get('https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=' + latitude + '%2C' + longitude + '&language=en', this.options);
  }

  getCompleteCity(nom: string): Observable<any> {
    return this.http.get('https://geocoding-api.open-meteo.com/v1/search?name=' + nom);
  }

  changeCity(city: any): void {
    this.actualCity = city;
    this.getCurrentWeather(city.latitude, city.longitude).subscribe(data => {
      this.actualCity.temperature = data.current_weather.temperature;
    })
  }

  addCity(city: any): void {

    var pres = false;

    this.saveCities.forEach(element => {
      if (element.id == city.id) {
        pres = true;
      }
    });

    if (!pres) {
      this.saveCities.push(city);
      this.actualCity = null;

      this.saveToSession();
    }

  }

  deleteCity(city: any): void {
    this.saveCities = this.saveCities.filter(c => c.id !== city.id);

    this.saveToSession();
  }

  saveToSession() {
    localStorage.setItem('saveCities', JSON.stringify(this.saveCities));
  }

  updateSaveCities() {

    for (let i = 0; i < this.saveCities.length; i++) {
      this.getCompleteCity(this.saveCities[i].name).subscribe(data => {

        data.results.forEach((city: {
          longitude: number;
          latitude: number; id: any;
        }) => {

          if (city.id == this.saveCities[i].id) {
            this.saveCities[i] = city;

            this.getCurrentWeather(city.latitude, city.longitude).subscribe(data_weather => {
              this.saveCities[i].temperature = data_weather.current_weather.temperature;
            })
          }
        });
      })


    }
    this.saveToSession();
  }

}
