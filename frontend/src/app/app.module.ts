import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddNoteComponent } from './components/add-note/add-note.component';
import { ListNoteComponent } from './components/list-note/list-note.component';
import { UpdateNoteComponent } from './components/update-note/update-note.component';
import { GraphQLModule } from './graphql.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { NoteReducer } from './store/notes/notes.reducer';

@NgModule({
  declarations: [
    AppComponent,
    AddNoteComponent,
    ListNoteComponent,
    UpdateNoteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule,
    ReactiveFormsModule,
    StoreModule.forRoot({ diary: NoteReducer }),
    StoreDevtoolsModule.instrument({
      name: 'NgRx Notes App',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
