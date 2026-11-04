import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-mcf-book-chapter',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './mcf-book-chapter.component.html',
  styleUrl: './mcf-book-chapter.component.css'
})
export class McfBookChapterComponent {
  readonly chapterNumber: number | null;
  readonly pdfPath: string;
  readonly pdfUrl: SafeResourceUrl | null;
  pdfMissing = false;

  constructor(
    route: ActivatedRoute,
    sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    const chapter = route.snapshot.paramMap.get('chapter')?.toLowerCase() ?? '';
    const match = /^ch([1-8])$/.exec(chapter);
    this.chapterNumber = match ? Number(match[1]) : null;
    this.pdfPath = this.chapterNumber
      ? `/assets/mcf/books/ch${this.chapterNumber}.pdf`
      : '';
    this.pdfUrl = this.pdfPath
      ? sanitizer.bypassSecurityTrustResourceUrl(this.pdfPath)
      : null;

    if (this.pdfPath && isPlatformBrowser(platformId)) {
      void fetch(this.pdfPath, { method: 'HEAD' })
        .then(response => {
          this.pdfMissing = !response.ok;
        })
        .catch(error => {
          console.error('Could not check the MCF chapter PDF:', error);
          this.pdfMissing = true;
        });
    }
  }
}
