import { DatePipe } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, DatePipe, NgxPaginationModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  isLoading: boolean = true; // Loading state
  searchTerm: string = ''; // Search term for filtering
  itemsPerPage: number = 10; // Default items per page
  p: number = 1; // Current page number
  totalItems: number = 0; // Total number of items

  constructor(private service: AuthService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  users: any;
  fetchUsers = async () => {
    this.isLoading = true;
    let results = await this.service.getUsers({ search: this.searchTerm.trim(), page: this.p, limit: this.itemsPerPage });
    if(results!=null){
      this.isLoading = false;
      this.users = results;
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

  // Delete a user
  deleteUser(userId: string): void {
    // if (confirm('Are you sure you want to delete this user?')) {
    //   this.userService.deleteUser(userId).subscribe(
    //     () => {
    //       this.fetchUsers(); // Refresh the user list after deletion
    //     },
    //     (error) => {
    //       console.error('Error deleting user:', error);
    //     }
    //   );
    // }
  }
}
