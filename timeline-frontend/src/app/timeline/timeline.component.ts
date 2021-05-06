import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AuthService, TOKEN_NAME} from '../shared/services/auth.service';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']

})
export class TimelineComponent implements OnInit {
  private mode = 'view';

  public userName = '';
  public userId = '';
  public eventsNow: {name: string, _id: string}[] = [];
  public eventsPrev: {name: string, _id: string}[] = [];

  public formEvents: FormGroup;
  public tempId = '';

  constructor(
    private http: HttpClient,
    private readonly formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {

    this.getEvents()
      .subscribe(
        (response) => {
          this.eventsPrev = this.eventsNow  = response.result[0].timeline.events;
          this.userName = response.result[0].name;
          this.userId = response.result[0]._id;
          console.log('data', JSON.stringify(this.eventsPrev, null, 2));
        },
        (error)=> {
          console.log('error getting events:', error);
        })
  }

  createForm() {
    const formFields = {
      mtnTitle: ['', [Validators.required]]
    };
    this.formEvents = this.formBuilder.group(formFields);
    this.formEvents.controls['mtnTitle']
      .valueChanges
      .subscribe((value) => {
        console.log('milestone being named: ' + value);
      });

  }

  getEvents() {
    const url = 'http://localhost:4201/api/v1';
    const token = localStorage.getItem(TOKEN_NAME);
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    const options = { headers };
    return this.http.get<any>(`${AuthService.API_BASE_PATH}/timeline`, options);
  }

  saveEvents() {
    const url = 'http://localhost:4201/api/v1';
    const token = localStorage.getItem(TOKEN_NAME);
    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });
    const options = { headers };

    const events = this.eventsNow.map((event) => ({name: event.name}));
    const payloadSaveMilestones = {
      timeline: {
        events
      },
      _id: this.userId
    };

    return this.http.post<any>(`${AuthService.API_BASE_PATH}/timeline`, payloadSaveMilestones, options);
  }

  toggleMode() {

    if (this.mode === 'view') {

      this.mode = 'edit'; // change to edit mode
    } else {

      // update backend, get the response, update event arrays, reset the form
      this.saveEvents()
        .subscribe(
          (response) => {
            this.eventsPrev = this.eventsNow  = response.result.timeline.events;
            this.mode = 'view';
          },
          (error) => {
            console.log('failed to make API call: ', error);
          });
    }
  }

  editEvent(idx: number) {
    // look up by id and update the modified object
    console.log('we are about to update this: ' + idx);

    this.tempId = this.eventsNow[idx]._id || this.eventsNow.length.toString();
    this.formEvents.setValue({
      'mtnTitle': this.eventsNow[idx].name
    });
  }

  deleteEvent(idx: number) {
    // looks up by id and remove from latest events array
    console.log('we are about to remove index: ' + idx);
    this.eventsNow.splice(idx, 1);
  }

  saveEvent() {
    if (this.formEvents.get('mtnTitle').value.trim() === '') {
      console.log('we gracefully ignore this scenario');
      return;
    }

    if (this.tempId === '') {
      // fresh event just push it..
      this.eventsNow.push({
        name: this.formEvents.get('mtnTitle').value,
        _id: this.eventsNow.length.toString()
      });
    } else {

      // iterate through map & locate index of the event using its mongodb _id
      const index = this.eventsNow.findIndex(obj => obj._id === this.tempId);

      if (index > -1) {
        console.log('found the event at index: ' + index);

        this.eventsNow[index] = {
          name: this.formEvents.get('mtnTitle').value,
          _id: this.tempId
        };
      } else {

        console.log('adding it at top, it was deleted while it was being edited.');
        this.eventsNow.push({
          name: this.formEvents.get('mtnTitle').value,
          _id: this.tempId
        });
      }
    }
    this.clearForm();
  }

  clearForm() {
    this.tempId = '';
    this.formEvents.setValue({'mtnTitle': ''});
  }
}
