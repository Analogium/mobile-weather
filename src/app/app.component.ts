import { Component, NgModule } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
  
})

export class AppComponent {

  constructor() { 
    if (Capacitor.getPlatform() === 'ios') {
      SafeArea.getSafeAreaInsets().then((insets: SafeAreaInsets) => {
        const header = document.getElementsByTagName('header')[0];
        header.style.paddingTop = `${insets.insets.top}px`;
        header.style.paddingBottom = `${insets.insets.bottom}px`;
        header.style.paddingLeft = `${insets.insets.left}px`;
        header.style.paddingRight = `${insets.insets.right}px`;
      });
    }
  }

  ngOnInit(): void {
  }

}
