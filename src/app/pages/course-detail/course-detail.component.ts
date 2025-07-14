import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, Document } from '../../../services/api.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="course-detail-container" *ngIf="document">
      <div class="content-wrapper">
        <!-- Header Section -->
        <div class="course-header">
          <div class="course-thumbnail">
            <img [src]="document.thumbnail" [alt]="document.title">
            <div class="course-type">{{ document.type }}</div>
          </div>
          
          <div class="course-info">
            <h1 class="course-title">{{ document.title }}</h1>
            <div class="course-meta">
              <span class="subject">{{ document.subject }}</span>
              <span class="level">{{ document.level }}</span>
              <span class="pages">{{ document.pages }} pages</span>
            </div>
            <p class="course-description">{{ document.description }}</p>
            
            <div class="completion-info">
              <div class="completion-time">
                <div class="time-icon">⏱️</div>
                <div class="time-details">
                  <span class="time-label">Temps estimé</span>
                  <span class="time-value">{{ getEstimatedTime() }}</span>
                </div>
              </div>
              
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="progressPercentage"></div>
                </div>
                <span class="progress-text">{{ progressPercentage }}% complété</span>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="primary-btn" (click)="startCourse()">
                {{ progressPercentage > 0 ? 'Continuer' : 'Commencer' }}
              </button>
              <button class="secondary-btn" (click)="downloadDocument()">
                📥 Télécharger
              </button>
            </div>
          </div>
        </div>

        <!-- Related Content Section -->
        <div class="related-content">
          <h2>Contenu Associé</h2>
          
          <!-- Related Exercises -->
          <div class="related-section" *ngIf="relatedExercises.length > 0">
            <h3>
              <span class="section-icon">✏️</span>
              Exercices Associés
            </h3>
            <div class="related-grid">
              <div class="related-card" *ngFor="let exercise of relatedExercises" (click)="navigateToDetail(exercise)">
                <img [src]="exercise.thumbnail" [alt]="exercise.title">
                <div class="card-content">
                  <h4>{{ exercise.title }}</h4>
                  <p>{{ exercise.description }}</p>
                  <div class="card-meta">
                    <span>{{ exercise.pages }} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Fiches -->
          <div class="related-section" *ngIf="relatedFiches.length > 0">
            <h3>
              <span class="section-icon">📋</span>
              Fiches de Révision
            </h3>
            <div class="related-grid">
              <div class="related-card" *ngFor="let fiche of relatedFiches" (click)="navigateToDetail(fiche)">
                <img [src]="fiche.thumbnail" [alt]="fiche.title">
                <div class="card-content">
                  <h4>{{ fiche.title }}</h4>
                  <p>{{ fiche.description }}</p>
                  <div class="card-meta">
                    <span>{{ fiche.pages }} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Courses (for exercises and fiches) -->
          <div class="related-section" *ngIf="relatedCourses.length > 0">
            <h3>
              <span class="section-icon">📚</span>
              Cours Associés
            </h3>
            <div class="related-grid">
              <div class="related-card" *ngFor="let course of relatedCourses" (click)="navigateToDetail(course)">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="card-content">
                  <h4>{{ course.title }}</h4>
                  <p>{{ course.description }}</p>
                  <div class="card-meta">
                    <span>{{ course.pages }} pages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="loading-container" *ngIf="!document && !error">
      <div class="loading-spinner"></div>
      <p>Chargement du contenu...</p>
    </div>

    <!-- Error State -->
    <div class="error-container" *ngIf="error">
      <div class="error-icon">❌</div>
      <h2>Contenu non trouvé</h2>
      <p>{{ error }}</p>
      <button class="primary-btn" (click)="goBack()">Retour</button>
    </div>
  `,
  styles: [`
    .course-detail-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
    }

    .course-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 3rem;
      margin-bottom: 4rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2rem;
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .course-thumbnail {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      height: 200px;
    }

    .course-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-type {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .course-info {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .course-title {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
      margin: 0;
    }

    .course-meta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .course-meta span {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .subject {
      background: rgba(102, 126, 234, 0.3) !important;
    }

    .level {
      background: rgba(118, 75, 162, 0.3) !important;
    }

    .course-description {
      font-size: 1.1rem;
      line-height: 1.6;
      opacity: 0.9;
      margin: 0;
    }

    .completion-info {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 1.5rem;
      border-radius: 12px;
    }

    .completion-time {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .time-icon {
      font-size: 2rem;
    }

    .time-details {
      display: flex;
      flex-direction: column;
    }

    .time-label {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .time-value {
      font-size: 1.2rem;
      font-weight: 600;
    }

    .progress-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.9rem;
      font-weight: 600;
      min-width: 80px;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
    }

    .primary-btn, .secondary-btn {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .primary-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      flex: 1;
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .primary-btn:hover, .secondary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .related-content h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .related-section {
      margin-bottom: 3rem;
    }

    .related-section h3 {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .section-icon {
      font-size: 1.2rem;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .related-card {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .related-card:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.15);
    }

    .related-card img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }

    .card-content {
      padding: 1rem;
    }

    .card-content h4 {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .card-content p {
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .card-meta span {
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.8rem;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      color: white;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    .error-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .course-detail-container {
        padding: 4rem 1rem 2rem;
      }

      .course-header {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .course-title {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
      }

      .related-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  document: Document | null = null;
  relatedExercises: Document[] = [];
  relatedFiches: Document[] = [];
  relatedCourses: Document[] = [];
  progressPercentage = 0;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      if (id) {
        this.loadDocument(id);
      }
    });
  }

  loadDocument(id: number) {
    this.apiService.getDocuments().subscribe({
      next: (response) => {
        this.document = response.documents.find(doc => doc.id === id) || null;
        if (this.document) {
          this.loadRelatedContent();
          this.loadProgress();
        } else {
          this.error = 'Document non trouvé';
        }
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement du document';
        console.error('Error loading document:', error);
      }
    });
  }

  loadRelatedContent() {
    if (!this.document) return;

    this.apiService.getDocuments().subscribe({
      next: (response) => {
        const allDocuments = response.documents.filter(doc => doc.id !== this.document!.id);
        
        // Filter by same subject and level
        const sameSubjectAndLevel = allDocuments.filter(doc => 
          doc.subject === this.document!.subject && doc.level === this.document!.level
        );

        if (this.document!.type === 'cours') {
          this.relatedExercises = sameSubjectAndLevel.filter(doc => doc.type === 'exercices');
          this.relatedFiches = sameSubjectAndLevel.filter(doc => doc.type === 'fiches');
        } else if (this.document!.type === 'exercices') {
          this.relatedCourses = sameSubjectAndLevel.filter(doc => doc.type === 'cours');
          this.relatedFiches = sameSubjectAndLevel.filter(doc => doc.type === 'fiches');
        } else if (this.document!.type === 'fiches') {
          this.relatedCourses = sameSubjectAndLevel.filter(doc => doc.type === 'cours');
          this.relatedExercises = sameSubjectAndLevel.filter(doc => doc.type === 'exercices');
        }
      },
      error: (error) => {
        console.error('Error loading related content:', error);
      }
    });
  }

  loadProgress() {
    if (!this.document) return;
    
    const progress = JSON.parse(localStorage.getItem('userProgress') || '[]');
    const documentProgress = progress.find((p: any) => 
      p.contentType === 'document' && p.contentId === this.document!.id
    );
    
    this.progressPercentage = documentProgress ? documentProgress.progress : 0;
  }

  getEstimatedTime(): string {
    if (!this.document) return '0 min';
    
    // Estimate 2 minutes per page for reading
    const minutes = this.document.pages * 2;
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
    }
  }

  startCourse() {
    if (!this.document) return;
    
    // Update progress
    const newProgress = Math.min(this.progressPercentage + 10, 100);
    this.apiService.updateProgress('document', this.document.id, newProgress, newProgress === 100).subscribe();
    this.progressPercentage = newProgress;
    
    // In a real app, this would navigate to the actual course content
    alert(`${this.progressPercentage > 10 ? 'Continuation' : 'Début'} du cours: ${this.document.title}`);
  }

  downloadDocument() {
    if (!this.document) return;
    
    // In a real app, this would trigger the actual download
    alert(`Téléchargement de: ${this.document.title}`);
  }

  navigateToDetail(document: Document) {
    this.router.navigate(['/course-detail', document.id]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}