import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-mc-bible-world',
  standalone: true,
  imports: [FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './mc-bible-world.component.html',
  styleUrl: './mc-bible-world.component.css'
})
export class McBibleWorldComponent {
  readonly realmInviteLink = 'https://realms.gg/bFR7ZyGfVDVgQqs';
  password = '';
  passwordError = '';
  isRealmLinkRevealed = false;
  copyStatus = '';

  unlockRealmLink(): void {
    this.passwordError = '';
    this.copyStatus = '';

    if (this.password !== 'MCBible2026') {
      this.passwordError = 'That password is not correct. Please check the password emailed to your parent and try again.';
      return;
    }

    this.isRealmLinkRevealed = true;
    this.password = '';
  }

  async copyRealmLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.realmInviteLink);
      this.copyStatus = 'Realm link copied to clipboard.';
    } catch {
      this.copyStatus = 'Unable to copy the link. Please select and copy it manually.';
    }
  }
}
