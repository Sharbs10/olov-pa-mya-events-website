import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DEV_ACCESS_QUESTIONS } from '../../../services/dev-access.config';
import { DevAccessService } from '../../../services/dev-access.service';

@Component({
  selector: 'app-dev-access',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dev-access.component.html',
  styleUrl: './dev-access.component.css'
})
export class DevAccessComponent {
  readonly questions = DEV_ACCESS_QUESTIONS;
  answers = ['', '', ''];
  errorMessage = '';

  constructor(
    readonly access: DevAccessService,
    private readonly router: Router
  ) {
    if (access.isAuthorized) void router.navigate(['/dev/pdf']);
  }

  submitAnswers(): void {
    this.errorMessage = '';
    if (!this.access.isConfigured) return;

    if (!this.access.verify(this.answers)) {
      this.errorMessage = 'Those answers do not open the bridge. Try again.';
      return;
    }

    void this.router.navigate(['/dev/pdf']);
  }
}
