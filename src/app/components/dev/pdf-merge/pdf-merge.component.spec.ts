import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { DevAccessService } from '../../../services/dev-access.service';
import { PdfMergeComponent } from './pdf-merge.component';

describe('PdfMergeComponent', () => {
  let component: PdfMergeComponent;
  let mergedBlob: Blob;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PdfMergeComponent],
      providers: [
        { provide: DevAccessService, useValue: { clearAuthorization: jasmine.createSpy() } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    });

    component = TestBed.createComponent(PdfMergeComponent).componentInstance;
    spyOn(URL, 'createObjectURL').and.callFake(blob => {
      mergedBlob = blob as Blob;
      return 'blob:merged-pdf';
    });
    spyOn(URL, 'revokeObjectURL');
  });

  it('merges PDFs in the displayed slot order', async () => {
    const firstPdf = await PDFDocument.create();
    firstPdf.addPage([120, 240]);
    const secondPdf = await PDFDocument.create();
    secondPdf.addPage([360, 480]);

    component.slots = [
      { id: 1, file: new File([await firstPdf.save()], 'first.pdf', { type: 'application/pdf' }) },
      { id: 2, file: new File([await secondPdf.save()], 'second.pdf', { type: 'application/pdf' }) }
    ];

    await component.mergePdfs();

    const merged = await PDFDocument.load(await mergedBlob.arrayBuffer());
    const pages = merged.getPages();
    expect(pages.length).toBe(2);
    expect(pages[0].getSize().width).toBe(120);
    expect(pages[1].getSize().width).toBe(360);
    expect(component.downloadUrl).toBe('blob:merged-pdf');
  });

  it('uses the entered name for the downloaded PDF and ensures a PDF extension', () => {
    component.outputFileName = 'event-packet.pdf';
    expect(component.downloadFileName).toBe('event-packet.pdf');

    component.outputFileName = 'Fall: Event Packet';
    expect(component.downloadFileName).toBe('Fall- Event Packet.pdf');

    component.outputFileName = '   ';
    expect(component.downloadFileName).toBe('merged-document.pdf');
  });
});
