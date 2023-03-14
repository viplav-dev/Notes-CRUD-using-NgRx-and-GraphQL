import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/note.model';
import { Store } from '@ngrx/store';
import {
  addNoteAction,
  deleteNoteAction,
} from 'src/app/store/notes/notes.actions';
import { Observable } from 'rxjs';
import { selectAllNotes } from 'src/app/store/notes/notes.selectors';
import { AppState } from 'src/app/app.state';

@Component({
  selector: 'app-list-note',
  templateUrl: './list-note.component.html',
  styleUrls: ['./list-note.component.css'],
})
export class ListNoteComponent {
  notes$: Observable<Note[]>;
  noteId$!: string;

  constructor(private service: NoteService, private store: Store<AppState>) {
    this.notes$ = this.store.select(selectAllNotes);
    this.service.noteId$.subscribe((id) => {
      this.noteId$ = id;
    });
  }

  ondeleteNote(id: string) {
    this.service.deleteNotes(id).subscribe((data) => {
      if(id===this.noteId$){
        this.service.showUpdate$.next(false);
      }
      if (data) {
        this.store.dispatch(deleteNoteAction({ id }));
      }
    });
  }
  showAddNote() {
    this.service.showAdd$.next(true);
    this.service.showUpdate$.next(false);
  }
  onUpdateNote(id: string) {
    this.service.showAdd$.next(false);
    this.service.showUpdate$.next(true);
    this.service.noteId$.next(id);
  }
}
