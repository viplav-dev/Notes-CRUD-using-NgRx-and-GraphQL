import { Component } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/note.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.state';
import { selectAllNotes } from 'src/app/store/notes/notes.selectors';

import { updateNoteAction } from 'src/app/store/notes/notes.actions';

@Component({
  selector: 'app-update-note',
  templateUrl: './update-note.component.html',
  styleUrls: ['./update-note.component.css'],
})
export class UpdateNoteComponent {
  singleNote!: Note;

  constructor(private service: NoteService, private store: Store<AppState>) {
    this.service.noteId$.subscribe((id) => {
      this.store.select(selectAllNotes).subscribe((notes) => {
        this.singleNote = notes.filter((note) => note.id === id)[0];
      });
    });
  }
  hideUpdateComponent() {
    this.service.showUpdate$.next(false);
  }
  updateNoteItem(title: string, description: string, id: string) {
    const note: Partial<Note> = {
      title: title,
      description: description,
      id: id,
    };
    this.service.updateNote(note).subscribe((result) => {
      if (result) {
        this.store.dispatch(updateNoteAction({ note: result.data.updateNote }));
        this.service.showUpdate$.next(false);
      }
    });
  }
}
