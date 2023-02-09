import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  public city = history.state.data.item;
  public detailsMeteo: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    
    this.getCurrentWeatherOnAWeek().subscribe(data => {
      console.log(data);
      this.detailsMeteo = data;
    })
    
  }


  public getCurrentWeatherOnAWeek() {
    const date = new Date().toISOString().substring(0,10);
    const dateSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0,10);

    return this.http.get("https://api.open-meteo.com/v1/forecast?latitude="+ this.city.latitude +"&longitude="+ this.city.longitude + "&hourly=temperature_2m&current_weather=true&start_date=" + date + "&end_date=" + dateSevenDays );
  }
}
