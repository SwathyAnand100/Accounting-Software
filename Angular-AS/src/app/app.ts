import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TopNavigation } from './top-navigation/top-navigation';
import { Navigation } from './navigation/navigation';
import { Transactions } from './transactions/transactions';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopNavigation, Navigation, Transactions],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Angular-AS';
}