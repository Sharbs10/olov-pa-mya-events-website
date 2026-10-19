import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private readonly location: Location,
    private readonly router: Router
  ) {}

  get showBack(): boolean {
    return this.router.url.split(/[?#]/, 1)[0] !== '/';
  }

  goBack(): void {
    const state = this.location.getState();
    const navigationId = typeof state === 'object' && state !== null && 'navigationId' in state
      ? state.navigationId
      : undefined;

    if (typeof navigationId === 'number' && navigationId > 1) {
      this.location.back();
      return;
    }

    const currentPath = this.router.url.split('?')[0].split('#')[0];
    const parentPath = currentPath.match(/^\/(mcf|myo|mya)(?:\/|$)/)?.[1];
    this.router.navigateByUrl(parentPath ? `/${parentPath}` : '/');
  }
}
