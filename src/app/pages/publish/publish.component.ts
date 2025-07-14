import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publish',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="publish-container">
      <div class="content-wrapper">
        <div class="publish-header">
          <h1 class="page-title">Publier un Document</h1>
          <p class="page-subtitle">Partagez vos connaissances avec la communauté Edu-Nova</p>
        </div>

        <form class="publish-form" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3>Informations Générales</h3>
            
            <div class="form-group">
              <label for="title">Titre du document *</label>
              <input 
                type="text" 
                id="title" 
                [(ngModel)]="formData.title"
                name="title"
                placeholder="Ex: Analyse Mathématique - Limites et Continuité"
                required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="type">Type de document *</label>
                <select id="type" [(ngModel)]="formData.type" name="type" required>
                  <option value="">Sélectionnez le type</option>
                  <option value="cours">Cours</option>
                  <option value="exercices">Exercices</option>
                  <option value="fiches">Fiches de révision</option>
                </select>
              </div>

              <div class="form-group">
                <label for="subject">Matière *</label>
                <select id="subject" [(ngModel)]="formData.subject" name="subject" required>
                  <option value="">Sélectionnez la matière</option>
                  <option value="Mathématiques">Mathématiques</option>
                  <option value="Physique">Physique</option>
                  <option value="Chimie">Chimie</option>
                  <option value="Informatique">Informatique</option>
                  <option value="Histoire">Histoire</option>
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Philosophie">Philosophie</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="level">Niveau *</label>
                <select id="level" [(ngModel)]="formData.level" name="level" required>
                  <option value="">Sélectionnez le niveau</option>
                  <option value="Terminale">Terminale</option>
                  <option value="Prépa">Prépa</option>
                  <option value="Université">Université</option>
                </select>
              </div>

              <div class="form-group">
                <label for="pages">Nombre de pages</label>
                <input 
                  type="number" 
                  id="pages" 
                  [(ngModel)]="formData.pages"
                  name="pages"
                  placeholder="Ex: 45"
                  min="1">
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea 
                id="description" 
                [(ngModel)]="formData.description"
                name="description"
                placeholder="Décrivez le contenu de votre document..."
                rows="4"
                required></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>Fichiers</h3>
            
            <div class="file-upload-section">
              <div class="upload-area" (click)="triggerFileInput()" 
                   [class.dragover]="isDragOver"
                   (dragover)="onDragOver($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)">
                <div class="upload-icon">📄</div>
                <p class="upload-text">
                  <strong>Cliquez pour sélectionner</strong> ou glissez-déposez votre document
                </p>
                <p class="upload-hint">PDF, DOC, DOCX (Max: 50MB)</p>
                <input 
                  type="file" 
                  #fileInput
                  (change)="onFileSelected($event)"
                  accept=".pdf,.doc,.docx"
                  style="display: none;">
              </div>

              <div class="selected-file" *ngIf="selectedFile">
                <div class="file-info">
                  <div class="file-icon">📄</div>
                  <div class="file-details">
                    <span class="file-name">{{ selectedFile.name }}</span>
                    <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
                  </div>
                </div>
                <button type="button" class="remove-file" (click)="removeFile()">✕</button>
              </div>
            </div>

            <div class="thumbnail-section">
              <label>Image de couverture (optionnel)</label>
              <div class="thumbnail-upload" (click)="triggerThumbnailInput()">
                <img *ngIf="thumbnailPreview" [src]="thumbnailPreview" alt="Aperçu">
                <div *ngIf="!thumbnailPreview" class="thumbnail-placeholder">
                  <div class="thumbnail-icon">🖼️</div>
                  <p>Ajouter une image</p>
                </div>
                <input 
                  type="file" 
                  #thumbnailInput
                  (change)="onThumbnailSelected($event)"
                  accept="image/*"
                  style="display: none;">
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Paramètres de Publication</h3>
            
            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.isPublic"
                  name="isPublic">
                <span class="checkmark"></span>
                Rendre ce document public
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="formData.allowComments"
                  name="allowComments">
                <span class="checkmark"></span>
                Autoriser les commentaires
              </label>
            </div>

            <div class="form-group">
              <label for="tags">Tags (séparés par des virgules)</label>
              <input 
                type="text" 
                id="tags" 
                [(ngModel)]="formData.tags"
                name="tags"
                placeholder="Ex: analyse, limites, continuité, mathématiques">
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-btn" (click)="saveDraft()">
              💾 Sauvegarder comme brouillon
            </button>
            <button type="submit" class="primary-btn" [disabled]="!isFormValid()">
              🚀 Publier le document
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .publish-container {
      min-height: 100vh;
      padding: 6rem 2rem 4rem;
      color: white;
    }

    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }

    .publish-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .page-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .publish-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .form-section h3 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      color: #a18cd1;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      font-size: 1rem;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
    }

    .form-group select option {
      background: #333;
      color: white;
    }

    .file-upload-section {
      margin-bottom: 2rem;
    }

    .upload-area {
      border: 2px dashed rgba(255, 255, 255, 0.3);
      border-radius: 12px;
      padding: 3rem 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.05);
    }

    .upload-area:hover,
    .upload-area.dragover {
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.1);
    }

    .upload-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .upload-text {
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }

    .upload-hint {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .selected-file {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.1);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .file-icon {
      font-size: 1.5rem;
    }

    .file-details {
      display: flex;
      flex-direction: column;
    }

    .file-name {
      font-weight: 600;
    }

    .file-size {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .remove-file {
      background: rgba(220, 53, 69, 0.2);
      color: #ff6b6b;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    .remove-file:hover {
      background: rgba(220, 53, 69, 0.3);
    }

    .thumbnail-section {
      margin-top: 2rem;
    }

    .thumbnail-upload {
      width: 200px;
      height: 120px;
      border: 2px dashed rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      cursor: pointer;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }

    .thumbnail-upload:hover {
      border-color: rgba(255, 255, 255, 0.6);
    }

    .thumbnail-upload img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnail-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      background: rgba(255, 255, 255, 0.05);
    }

    .thumbnail-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-weight: 500;
    }

    .checkbox-label input[type="checkbox"] {
      width: auto;
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
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
    }

    .primary-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .primary-btn:hover:not(:disabled),
    .secondary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .publish-container {
        padding: 4rem 1rem 2rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .upload-area {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class PublishComponent {
  formData = {
    title: '',
    type: '',
    subject: '',
    level: '',
    pages: null,
    description: '',
    isPublic: true,
    allowComments: true,
    tags: ''
  };

  selectedFile: File | null = null;
  thumbnailPreview: string | null = null;
  isDragOver = false;

  constructor(private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onThumbnailSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.thumbnailPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]:not([accept="image/*"])') as HTMLInputElement;
    fileInput?.click();
  }

  triggerThumbnailInput() {
    const thumbnailInput = document.querySelector('input[accept="image/*"]') as HTMLInputElement;
    thumbnailInput?.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  removeFile() {
    this.selectedFile = null;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title &&
      this.formData.type &&
      this.formData.subject &&
      this.formData.level &&
      this.formData.description &&
      this.selectedFile
    );
  }

  saveDraft() {
    const draft = {
      ...this.formData,
      file: this.selectedFile?.name,
      thumbnail: this.thumbnailPreview,
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('documentDraft', JSON.stringify(draft));
    alert('Brouillon sauvegardé avec succès !');
  }

  onSubmit() {
    if (!this.isFormValid()) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // In a real app, this would upload the file and create the document
    alert(`Document "${this.formData.title}" publié avec succès !`);
    this.router.navigate(['/dashboard']);
  }
}