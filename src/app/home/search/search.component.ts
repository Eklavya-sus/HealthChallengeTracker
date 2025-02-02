import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { EventServices } from '../../services/EventServices/EventServices';
import { AddWorkoutComponent } from '../add-workout/add-workout.component'; 

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  standalone: true,
  imports: [CommonModule,FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, ReactiveFormsModule],
})
export class SearchComponent {
  options = [
    { value: 'All', label: 'All' },
    { value: 'Running', label: 'Running' },
    { value: 'Cycling', label: 'Cycling' },
    { value: 'Swimming', label: 'Swimming' },
    { value: 'Yoga', label: 'Yoga' },
    { value: 'Calisthenics', label: 'Calisthenics' }
  ];
  constructor(private events: EventServices,public dialog: MatDialog){

  }
  ngOnInit() {
    this.searchGroup.get('filter_field')?.valueChanges.subscribe(value => {
      this.events.emit("filter_field", value);
    });
    this.searchGroup.get('search_field')?.valueChanges.subscribe(value => {
      this.events.emit("search_field", value);
    });
  }
  filter : any = this.options[0];
  searchGroup = new FormGroup({
    search_field : new FormControl(""),
    filter_field: new FormControl(this.options[0].value)
  })
  submitForm(){
    this.events.emit("search_field", this.searchGroup.get('search_field')?.value);
  }
  addWorkout():void{
    this.dialog.open(AddWorkoutComponent,{
      width: '500px',
      height: 'auto'
    })
  }
}
