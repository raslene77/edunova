import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatar: string;
  level: string;
  specialty: string;
  joinDate: string;
}

export interface Document {
  id: number;
  title: string;
  type: string;
  subject: string;
  level: string;
  thumbnail: string;
  description: string;
  pages: number;
  downloadUrl: string;
}

export interface Video {
  id: number;
  title: string;
  subject: string;
  level: string;
  duration: string;
  thumbnail: string;
  description: string;
  views: number;
  videoUrl: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en' | 'ar';
  notifications: {
    email: boolean;
    push: boolean;
    newCourses: boolean;
    reminders: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showProgress: boolean;
    allowMessages: boolean;
  };
  preferences: {
    autoplay: boolean;
    subtitles: boolean;
    playbackSpeed: number;
    downloadQuality: 'low' | 'medium' | 'high';
  };
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Static data - no API calls, just JSON data
  private accounts: User[] = [
    {
      id: 1,
      fullName: "Ahmed Ben Ali",
      email: "ahmed.benali@email.com",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "Terminale",
      specialty: "Sciences Mathématiques",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      fullName: "Fatima Trabelsi",
      email: "fatima.trabelsi@email.com",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "1ère année Prépa",
      specialty: "Physique-Chimie",
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      fullName: "Mohamed Khelifi",
      email: "mohamed.khelifi@email.com",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "2ème année Prépa",
      specialty: "Mathématiques-Informatique",
      joinDate: "2023-09-10"
    },
    {
      id: 4,
      fullName: "Salma Bouazizi",
      email: "salma.bouazizi@email.com",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "Terminale",
      specialty: "Sciences Expérimentales",
      joinDate: "2024-03-05"
    },
    {
      id: 5,
      fullName: "Youssef Mansouri",
      email: "youssef.mansouri@email.com",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "1ère année Université",
      specialty: "Informatique",
      joinDate: "2023-11-12"
    },
    {
      id: 6,
      fullName: "Raslene Haddaji",
      email: "raslene.haddaji@email.com",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      level: "Prépa",
      specialty: "Technologie",
      joinDate: "2024-04-26"
    }
  ];

  private documents: Document[] = [
    {
      id: 1,
      title: "Analyse Mathématique - Limites et Continuité",
      type: "cours",
      subject: "Mathématiques",
      level: "Terminale",
      thumbnail: "https://images.pexels.com/photos/6256/mathematics-blackboard-education-classroom.jpg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Cours complet sur les limites et la continuité des fonctions",
      pages: 45,
      downloadUrl: "#"
    },
    {
      id: 2,
      title: "Physique Quantique - Introduction",
      type: "cours",
      subject: "Physique",
      level: "Prépa",
      thumbnail: "https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Les bases de la mécanique quantique",
      pages: 67,
      downloadUrl: "#"
    },
    {
      id: 3,
      title: "Exercices Corrigés - Algèbre Linéaire",
      type: "exercices",
      subject: "Mathématiques",
      level: "Prépa",
      thumbnail: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "50 exercices corrigés d'algèbre linéaire",
      pages: 89,
      downloadUrl: "#"
    },
    {
      id: 4,
      title: "Chimie Organique - Réactions",
      type: "fiches",
      subject: "Chimie",
      level: "Terminale",
      thumbnail: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Fiches de révision sur les réactions organiques",
      pages: 23,
      downloadUrl: "#"
    },
    {
      id: 5,
      title: "Programmation Python - Structures de Données",
      type: "cours",
      subject: "Informatique",
      level: "Université",
      thumbnail: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Guide complet des structures de données en Python",
      pages: 112,
      downloadUrl: "#"
    },
    {
      id: 6,
      title: "Histoire de la Tunisie Moderne",
      type: "cours",
      subject: "Histoire",
      level: "Terminale",
      thumbnail: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "L'évolution de la Tunisie au XXe siècle",
      pages: 78,
      downloadUrl: "#"
    }
  ];

  private videos: Video[] = [
    {
      id: 1,
      title: "Dérivées et Applications - Cours Complet",
      subject: "Mathématiques",
      level: "Terminale",
      duration: "45:30",
      thumbnail: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Maîtrisez les dérivées et leurs applications pratiques",
      views: 12500,
      videoUrl: "#"
    },
    {
      id: 2,
      title: "Électromagnétisme - Lois de Maxwell",
      subject: "Physique",
      level: "Prépa",
      duration: "38:15",
      thumbnail: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Comprendre les équations de Maxwell",
      views: 8900,
      videoUrl: "#"
    },
    {
      id: 3,
      title: "Algorithmes de Tri - Comparaison",
      subject: "Informatique",
      level: "Université",
      duration: "52:20",
      thumbnail: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Analyse des différents algorithmes de tri",
      views: 15600,
      videoUrl: "#"
    },
    {
      id: 4,
      title: "Réactions Acide-Base",
      subject: "Chimie",
      level: "Terminale",
      duration: "29:45",
      thumbnail: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Les équilibres acide-base expliqués",
      views: 7800,
      videoUrl: "#"
    },
    {
      id: 5,
      title: "Analyse Littéraire - Méthodes",
      subject: "Français",
      level: "Terminale",
      duration: "41:10",
      thumbnail: "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Techniques d'analyse des textes littéraires",
      views: 9200,
      videoUrl: "#"
    },
    {
      id: 6,
      title: "Géométrie dans l'Espace",
      subject: "Mathématiques",
      level: "Prépa",
      duration: "56:30",
      thumbnail: "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop",
      description: "Maîtriser la géométrie en 3D",
      views: 11400,
      videoUrl: "#"
    }
  ];

  constructor() {
    // Check if user is already logged in
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  // Authentication methods - no API calls
  login(email: string, password: string): Observable<any> {
    // Find user in static accounts array
    const user = this.accounts.find(account => 
      account.email === email && password === 'password123'
    );
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      this.currentUserSubject.next(user);
      
      return of({ user, token: 'mock-jwt-token' }).pipe(delay(500));
    } else {
      throw new Error('Email ou mot de passe incorrect');
    }
  }

  register(userData: any): Observable<any> {
    // Check if user already exists
    const existingUser = this.accounts.find(account => account.email === userData.email);
    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Create new user
    const newUser = {
      id: this.accounts.length + 1,
      fullName: userData.fullName,
      email: userData.email,
      avatar: this.getRandomAvatar(),
      level: userData.level,
      specialty: userData.specialty,
      joinDate: new Date().toISOString().split('T')[0]
    };

    // Add to accounts array
    this.accounts.push(newUser);

    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('isLoggedIn', 'true');
    this.currentUserSubject.next(newUser);

    return of({ user: newUser, token: 'mock-jwt-token' }).pipe(delay(500));
  }

  private getRandomAvatar(): string {
    const avatars = [
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Content methods - no API calls, just static data
  getDocuments(filters?: any): Observable<{ documents: Document[] }> {
    let documents = [...this.documents];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        documents = documents.filter((doc: Document) =>
          doc.title.toLowerCase().includes(search) ||
          doc.description.toLowerCase().includes(search) ||
          doc.subject.toLowerCase().includes(search)
        );
      }
      
      if (filters.subject) {
        documents = documents.filter((doc: Document) => doc.subject === filters.subject);
      }
      
      if (filters.level) {
        documents = documents.filter((doc: Document) => doc.level === filters.level);
      }
      
      if (filters.type) {
        documents = documents.filter((doc: Document) => doc.type === filters.type);
      }
    }
    
    return of({ documents }).pipe(delay(300));
  }

  getVideos(filters?: any): Observable<{ videos: Video[] }> {
    let videos = [...this.videos];
    
    if (filters) {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        videos = videos.filter((video: Video) =>
          video.title.toLowerCase().includes(search) ||
          video.description.toLowerCase().includes(search) ||
          video.subject.toLowerCase().includes(search)
        );
      }
      
      if (filters.subject) {
        videos = videos.filter((video: Video) => video.subject === filters.subject);
      }
      
      if (filters.level) {
        videos = videos.filter((video: Video) => video.level === filters.level);
      }
    }
    
    return of({ videos }).pipe(delay(300));
  }

  // Settings methods - localStorage only
  getSettings(): Observable<Settings> {
    const defaultSettings: Settings = {
      theme: 'auto',
      language: 'fr',
      notifications: {
        email: true,
        push: true,
        newCourses: true,
        reminders: false
      },
      privacy: {
        profileVisibility: 'public',
        showProgress: true,
        allowMessages: true
      },
      preferences: {
        autoplay: false,
        subtitles: true,
        playbackSpeed: 1,
        downloadQuality: 'medium'
      }
    };

    const savedSettings = localStorage.getItem('userSettings');
    const settings = savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    
    return of(settings).pipe(delay(200));
  }

  updateSettings(settings: Settings): Observable<any> {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    return of({ message: 'Settings updated successfully' }).pipe(delay(300));
  }

  // Progress tracking methods - localStorage only
  getUserProgress(): Observable<any> {
    const progress = localStorage.getItem('userProgress');
    return of({ progress: progress ? JSON.parse(progress) : [] }).pipe(delay(200));
  }

  updateProgress(contentType: string, contentId: number, progress: number, completed: boolean = false): Observable<any> {
    const existingProgress = JSON.parse(localStorage.getItem('userProgress') || '[]');
    const progressItem = {
      contentType,
      contentId,
      progress,
      completed,
      lastAccessed: new Date().toISOString()
    };
    
    const index = existingProgress.findIndex((p: any) => 
      p.contentType === contentType && p.contentId === contentId
    );
    
    if (index >= 0) {
      existingProgress[index] = progressItem;
    } else {
      existingProgress.push(progressItem);
    }
    
    localStorage.setItem('userProgress', JSON.stringify(existingProgress));
    return of({ message: 'Progress updated successfully' }).pipe(delay(200));
  }

  // Statistics methods - localStorage only
  getUserStats(): Observable<any> {
    const progress = JSON.parse(localStorage.getItem('userProgress') || '[]');
    const completedCourses = progress.filter((p: any) => p.contentType === 'document' && p.completed).length;
    const completedExercises = progress.filter((p: any) => p.contentType === 'exercise' && p.completed).length;
    
    const stats = {
      courses: completedCourses || 24,
      exercises: completedExercises || 156,
      successRate: 89,
      hoursThisWeek: 12
    };
    
    return of(stats).pipe(delay(300));
  }
}