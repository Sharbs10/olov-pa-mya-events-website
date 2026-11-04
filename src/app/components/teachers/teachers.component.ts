import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../shared/footer/footer.component';
import { HeaderComponent } from '../shared/header/header.component';

interface TeacherResource {
  title: string;
  fileType: string;
  filename: string;
}

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './teachers.component.html',
  styleUrl: './teachers.component.css'
})
export class TeachersComponent {
  private readonly teacherNames = [
    'Dima',
    'Maria',
    'Mia',
    'Marie-Belle',
    'Sharbel',
    'Tony',
    'Hoda',
    'Chloe',
    'Christelle'
  ];

  readonly calendars: TeacherResource[] = [
    { title: 'Eparchial Desk Calendar 2026', fileType: 'PDF', filename: 'eparchial-desk-calendar-2026.pdf' },
    { title: 'Eparchial Desk Calendar 2027', fileType: 'PDF', filename: 'eparchial-desk-calendar-2027.pdf' },
    { title: 'MCF Calendar 2026–2027', fileType: 'PDF', filename: 'mcf-calendar-2026-2027.pdf' }
  ];

  readonly lessonMaterials: TeacherResource[] = [
    { title: 'The Church', fileType: 'Word document', filename: 'the-church.docx' },
    { title: 'The Faithful Living', fileType: 'Word document', filename: 'the-faithful-living.docx' },
    { title: 'The Faithful Rulers', fileType: 'Word document', filename: 'the-faithful-rulers.docx' },
    { title: 'Those in Need', fileType: 'Word document', filename: 'those-in-need.docx' },
    { title: 'Grades 4–6 Lesson Plan', fileType: 'PDF', filename: 'grades-4-6-lesson-plan.pdf' },
    { title: 'Sunday Gospel Stories', fileType: 'Word document', filename: 'sunday-gospel-stories.docx' }
  ];

  readonly teacherDirectory: TeacherResource = {
    title: 'MCF Teachers Directory',
    fileType: 'Excel spreadsheet',
    filename: 'mcf-teachers-directory.xlsx'
  };

  teacherName = '';
  errorMessage = '';
  isAuthenticated = false;

  submitName(): void {
    this.errorMessage = '';
    const enteredName = this.teacherName.trim().toLowerCase();

    if (!this.teacherNames.some(name => name.toLowerCase() === enteredName)) {
      this.errorMessage = 'That name was not recognized. Please check the spelling and try again.';
      return;
    }

    this.isAuthenticated = true;
  }

  lockResources(): void {
    this.isAuthenticated = false;
    this.teacherName = '';
  }
}
