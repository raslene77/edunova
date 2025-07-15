import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DataService, User } from '../../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand" (click)="navigateHome()">
          <div class="brand-icon">E</div>
          <span class="brand-text">Edu-Nova</span>
        </div>

        <div class="nav-menu" [class.active]="isMenuOpen">
          <a routerLink="/home" class="nav-link" (click)="closeMenu()">Accueil</a>
          <a routerLink="/dashboard" class="nav-link" (click)="closeMenu()">Dashboard</a>
          <a routerLink="/documents" class="nav-link" (click)="closeMenu()">Documents</a>
          <a routerLink="/services" class="nav-link" (click)="closeMenu()">Services</a>
          
          <div class="nav-auth" *ngIf="!currentUser">
            <a routerLink="/connect" class="auth-btn login-btn" (click)="closeMenu()">Se connecter</a>
          </div>

          <div class="user-menu" *ngIf="currentUser">
            <div class="user-avatar" (click)="toggleUserDropdown()">
              <img [src]="currentUser.avatar" [alt]="currentUser.fullName">
              <span class="user-name">{{ currentUser.fullName }}</span>
              <span class="dropdown-arrow" [class.rotated]="isUserDropdownOpen">▼</span>
            </div>
            
            <div class="dropdown-menu" [class.show]="isUserDropdownOpen">
              <a routerLink="/profile" class="dropdown-item" (click)="closeAllMenus()">
                <span class="item-icon">👤</span>
                Profil
              </a>
              <a routerLink="/settings" class="dropdown-item" (click)="closeAllMenus()">
                <span class="item-icon">⚙️</span>
                Paramètres
              </a>
              <a routerLink="/publish" class="dropdown-item" (click)="closeAllMenus()">
                <span class="item-icon">📝</span>
                Publier
              </a>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item logout-item" (click)="logout()">
                <span class="item-icon">🚪</span>
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div class="nav-toggle" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .nav-brand:hover {
      transform: scale(1.05);
    }

    .brand-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .brand-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 25px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-link:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .nav-link.active {
      background: rgba(255, 255, 255, 0.2);
    }

    .nav-auth {
      display: flex;
      gap: 1rem;
    }

    .auth-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .login-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .user-menu {
      position: relative;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 25px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-avatar:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .user-avatar img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-name {
      color: white;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .dropdown-arrow {
      color: white;
      font-size: 0.8rem;
      transition: transform 0.3s ease;
    }

    .dropdown-arrow.rotated {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      margin-top: 0.5rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .dropdown-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .dropdown-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .logout-item {
      color: #ff6b6b;
    }

    .logout-item:hover {
      background: rgba(220, 53, 69, 0.1);
    }

    .item-icon {
      font-size: 1rem;
    }

    .dropdown-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0.5rem 0;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      cursor: pointer;
      gap: 4px;
    }

    .nav-toggle span {
      width: 25px;
      height: 3px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 1rem;
        height: 70px;
      }

      .nav-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 2rem;
        gap: 1rem;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav-toggle {
        display: flex;
      }

      .user-menu {
        width: 100%;
      }

      .user-avatar {
        justify-content: center;
      }

      .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        margin-top: 1rem;
        background: rgba(255, 255, 255, 0.05);
      }

      .brand-text {
        font-size: 1.3rem;
      }

      .brand-icon {
        width: 35px;
        height: 35px;
        font-size: 1.1rem;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isMenuOpen = false;
  isUserDropdownOpen = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateHome() {
    this.router.navigate(['/home']);
    this.closeAllMenus();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserDropdown() {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  closeAllMenus() {
    this.isMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  logout() {
    this.closeAllMenus();
    this.authService.logout();
  }
}