import { DatePipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, DatePipe, NgxPaginationModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  isLoading: boolean = true; // Loading state
  searchTerm: string = ''; // Search term for filtering
  itemsPerPage: number = 10; // Default items per page
  p: number = 1; // Current page number
  totalItems: number = 0; // Total number of items
  users: any = { docs: [] }; // Initialize with empty docs array
  selectedCompany: string | null = null;

  constructor(private service: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    this.isLoading = true;
    try {
      let results = await this.service.getUsers({ 
        search: this.searchTerm.trim(), 
        page: this.p, 
        limit: this.itemsPerPage 
      });
      
      if(results != null) {
        this.users = results;
        this.totalItems = results.totalDocs || (results.docs ? results.docs.length : 0);
      } else {
        this.users = { docs: [] };
        this.totalItems = 0;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      this.users = { docs: [] };
      this.totalItems = 0;
    } finally {
      this.isLoading = false;
    }
  }

  // Handle search input
  onSearch(): void {
    this.p = 1; 
    this.fetchUsers(); 
  }

  // Handle items per page change
  onItemsPerPageChange(): void {
    this.p = 1;
    this.fetchUsers();
  }

    pageChangeEvent(page: number): void {
    this.p = page;
    this.fetchUsers();
  }

  
  openEditModal(user: any): void {
  }

  trackByUserId(index: number, user: any): string {
    return user._id;
  }
 
  showCompany(user: any) {
    this.selectedCompany = user.companies && user.companies.length > 0 ? user.companies : "There is no company";
  }
  

}