import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { DevAccessService } from '../../../services/dev-access.service';

interface PdfSlot {
  id: number;
  file: File | null;
}

@Component({
  selector: 'app-pdf-merge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pdf-merge.component.html',
  styleUrl: './pdf-merge.component.css'
})
export class PdfMergeComponent implements OnDestroy {
  slots: PdfSlot[] = [{ id: 1, file: null }, { id: 2, file: null }];
  isMerging = false;
  errorMessage = '';
  downloadUrl = '';
  outputFileName = 'merged-document';
  private nextSlotId = 3;

  constructor(
    private readonly access: DevAccessService,
    private readonly router: Router
  ) {}

  get selectedCount(): number {
    return this.slots.filter(slot => slot.file !== null).length;
  }

  get canMerge(): boolean {
    return this.slots.length >= 2
      && this.slots.every(slot => slot.file !== null)
      && !this.isMerging;
  }

  get downloadFileName(): string {
    const safeName = this.outputFileName.trim()
      .replace(/\.pdf$/i, '')
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
      .replace(/[. ]+$/g, '');
    return `${safeName || 'merged-document'}.pdf`;
  }

  addPdf(): void {
    this.clearDownload();
    this.slots = [...this.slots, { id: this.nextSlotId++, file: null }];
  }

  selectPdf(slot: PdfSlot, event: Event): void {
    this.errorMessage = '';
    this.clearDownload();
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (file && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      slot.file = null;
      input.value = '';
      this.errorMessage = `"${file.name}" does not appear to be a PDF.`;
      return;
    }

    slot.file = file;
  }

  moveSlot(index: number, offset: -1 | 1): void {
    const destination = index + offset;
    if (destination < 0 || destination >= this.slots.length) return;
    this.clearDownload();
    const reordered = [...this.slots];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    this.slots = reordered;
  }

  removeSlot(index: number): void {
    if (this.slots.length <= 2) return;
    this.clearDownload();
    this.slots = this.slots.filter((_, slotIndex) => slotIndex !== index);
  }

  async mergePdfs(): Promise<void> {
    if (!this.canMerge) return;

    this.isMerging = true;
    this.errorMessage = '';
    this.clearDownload();

    try {
      const mergedPdf = await PDFDocument.create();
      for (const slot of this.slots) {
        const source = await PDFDocument.load(await slot.file!.arrayBuffer());
        const pages = await mergedPdf.copyPages(source, source.getPageIndices());
        for (const page of pages) mergedPdf.addPage(page);
      }

      const bytes = await mergedPdf.save();
      this.downloadUrl = URL.createObjectURL(
        new Blob([bytes], { type: 'application/pdf' })
      );
    } catch (error) {
      console.error('Could not merge the selected PDFs:', error);
      this.errorMessage = 'The PDFs could not be merged. Check that each file is valid and not password-protected, then try again.';
    } finally {
      this.isMerging = false;
    }
  }

  logOut(): void {
    this.access.clearAuthorization();
    void this.router.navigate(['/dev']);
  }

  ngOnDestroy(): void {
    this.clearDownload();
  }

  private clearDownload(): void {
    if (this.downloadUrl) URL.revokeObjectURL(this.downloadUrl);
    this.downloadUrl = '';
  }
}
