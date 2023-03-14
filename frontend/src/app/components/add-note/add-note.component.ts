import { Component } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/note.model';
import { AppState } from 'src/app/app.state';
import { Store } from '@ngrx/store';
import { addNoteAction } from 'src/app/store/notes/notes.actions';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.css'],
})
export class AddNoteComponent {
  notes: Note[] = [];
  constructor(private service: NoteService, private store: Store<AppState>) {}

  addNoteItem(
    title: string,
    description: string
    //  userId: string = '1'
  ) {
    const note: Partial<Note> = {
      title: title,
      description: description,
      userId: '640dd7792d39d1412a999b51',
    };

    this.service.addNotes(note).subscribe((data) => {
      this.store.dispatch(addNoteAction({ note: data.data.addNote }));
      this.service.showAdd$.next(false);
    });
  }
  hideAddComponent() {
    this.service.showAdd$.next(false);
  }
}
