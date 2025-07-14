import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService, User } from './data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser$ = this.dataService.currentUser$;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.dataService.login(email, password);
  }

  register(userData: any): Observable<any> {
    return this.dataService.register(userData);
  }

  logout(): void {
    this.dataService.logout();
    // Clear all user-related data
    localStorage.removeItem('userSettings');
    localStorage.removeItem('userProgress');
    this.router.navigate(['/home']).then(() => {
      // Ensure we're on the home page after logout
      window.location.reload();
    });
  }

  getCurrentUser(): User | null {
    return this.dataService.getCurrentUserValue();
  }

  isLoggedIn(): boolean {
    return this.dataService.isLoggedIn();
  }
}