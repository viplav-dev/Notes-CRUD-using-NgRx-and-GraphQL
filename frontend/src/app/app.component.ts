import { Component } from '@angular/core';
import { NoteService } from './services/note.service';
import { Note } from './note.model';
import { addNoteAction } from './store/notes/notes.actions';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'codingAssessment3';
  showAdd: boolean = false;
  showUpdate: boolean = false;
  constructor(
    private service: NoteService,
    private store: Store<AppState>
  ) {
    this.service.showAdd$.subscribe((data) => (this.showAdd = data));
    this.service.showUpdate$.subscribe((data) => (this.showUpdate = data));
    this.service.getNotes().subscribe(({ data, error }: any) => {
      data.notes.forEach((note: Note) => {
        this.store.dispatch(addNoteAction({ note: note }));
      });
    });
  }
}
