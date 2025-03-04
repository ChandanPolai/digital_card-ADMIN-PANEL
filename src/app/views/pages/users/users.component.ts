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
        // Set totalItems from the API response
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
    this.p = 1; // Reset to the first page when searching
    this.fetchUsers(); // Fetch users based on the search term
  }

  // Handle items per page change
  onItemsPerPageChange(): void {
    this.p = 1; // Reset to the first page when changing items per page
    this.fetchUsers();
  }

  // Handle page change event
  pageChangeEvent(page: number): void {
    this.p = page;
    this.fetchUsers();
  }

  // Open edit modal for a user
  openEditModal(user: any): void {
    // Implement logic to open an edit modal
    console.log('Edit user:', user);
  }

  trackByUserId(index: number, user: any): string {
    return user._id;
  }
  

  // Delete a user
  // deleteUser(userId: string): void {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     this.service.deleteUser(userId).then(() => {
  //       this.fetchUsers(); // Refresh the user list after deletion
  //     }).catch((error) => {
  //       console.error('Error deleting user:', error);
  //     });
  //   }
  // }


  



}