import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DEV_ACCESS_QUESTIONS } from './dev-access.config';

const ACCESS_STORAGE_KEY = 'dev-area-authorized';

@Injectable({ providedIn: 'root' })
export class DevAccessService {
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get isConfigured(): boolean {
    return DEV_ACCESS_QUESTIONS.length === 3 && DEV_ACCESS_QUESTIONS.every(
      question => question.prompt.trim().length > 0
        && question.acceptedAnswers.some(answer => answer.trim().length > 0)
    );
  }

  get isAuthorized(): boolean {
    return this.isBrowser && sessionStorage.getItem(ACCESS_STORAGE_KEY) === 'true';
  }

  verify(answers: string[]): boolean {
    if (!this.isBrowser || !this.isConfigured || answers.length !== 3) return false;

    const valid = DEV_ACCESS_QUESTIONS.every((question, index) => {
      const submittedAnswer = this.normalize(answers[index]);
      return question.acceptedAnswers.some(
        acceptedAnswer => this.normalize(acceptedAnswer) === submittedAnswer
      );
    });

    if (valid) sessionStorage.setItem(ACCESS_STORAGE_KEY, 'true');
    return valid;
  }

  clearAuthorization(): void {
    if (this.isBrowser) sessionStorage.removeItem(ACCESS_STORAGE_KEY);
  }

  private normalize(value: string): string {
    return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
  }
}
