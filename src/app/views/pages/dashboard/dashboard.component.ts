import { AuthService } from 'src/app/services/auth.service';
import { Component, type OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.getDashboard();
  }

  dashboard:any = { users: "0", businessCards: "0" };

  async getDashboard(){
    let results = await this.authService.getDashboard({});
    if(results!=null){
      this.dashboard.users = results.users || 0;
      this.dashboard.businessCards = results.businessCards || 0;
    }
  }

}
