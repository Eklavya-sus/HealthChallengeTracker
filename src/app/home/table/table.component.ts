import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EventServices } from '../../services/EventServices/EventServices';
import { UpdateWorkoutServices } from '../../services/updateWorkoutServices/updateWorkoutService';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  currentFilter: string = 'All';
  userData = JSON.parse(localStorage.getItem('userData')!);
  tableData = [...this.userData]; // Create a copy of the user data
  currentPage = 0;
  pageSize = 5;
  totalItems = this.tableData.length;
  paginatedData = this.paginateData(this.tableData, this.currentPage, this.pageSize);
  displayedColumns: string[] = ['name', 'workouts', 'numberOfWorkouts', 'totalWorkoutMinutes'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private events: EventServices,
    private workoutService: UpdateWorkoutServices
  ) {
    this.events.listen("filter_field", (value: string) => this.filterData(value));
    this.events.listen("search_field", (value: string) => this.searchByName(value));
  }

  ngOnInit() {
    this.updatePaginatedData();
    this.workoutService.workouts$.subscribe((workouts) => {
      if (workouts.length > 0) {
        this.userData = workouts;
        this.tableData = [...workouts]; // Reset to latest data and apply filter
        this.updatePaginatedData();
        this.table.renderRows();
      }
    });
  }

  transformWorkouts(workouts: { type: string, mins: number }[]): string {
    return workouts.map(workout => workout.type).join(", ");
  }

  transformMinutes(workouts: { type: string, minutes: number }[]): number {
    let totalMins: number = 0;
    workouts.forEach(workout => totalMins += workout.minutes);
    return totalMins;
  }

  // Search Functionality
// Search Functionality
searchByName(value: string) {
  // When search is cleared (value is empty), apply only the current filter
  if (value.length === 0) {
    // Reset to filtered data, not all data
    this.tableData = [...this.userData]; // Start fresh
    const currentFilter = this.currentFilter; // You'll need to add this property
    if (currentFilter && currentFilter !== 'All') {
      this.filterData(currentFilter);
    }
  } else {
    // Apply search on the current filtered data
    this.tableData = this.tableData.filter((ele: { id: number; name: string; workouts: [] }) => 
      ele.name.toLowerCase().includes(value.toLowerCase())
    );
  }
  this.updatePaginatedData();
}
  

  // Filter Functionality
  filterData(value: string) {
    this.currentFilter = value; // Store the current filter
    this.tableData = value === "All" 
      ? [...this.userData] // Use spread operator to create a new array
      : this.userData.filter(
          (ele: { id: number; name: string; workouts: { type: string; minutes: number }[] }) =>
            ele.workouts.some((workout) => workout.type === value)
        );
    this.updatePaginatedData();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    this.totalItems = this.tableData.length;

    // Ensure currentPage is within range
    if (this.currentPage * this.pageSize >= this.totalItems) {
      this.currentPage = Math.max(0, Math.ceil(this.totalItems / this.pageSize) - 1);
    }

    this.paginatedData = this.paginateData(this.tableData, this.currentPage, this.pageSize);

    if (this.paginator) {
      this.paginator.pageIndex = this.currentPage;
    }
  }

  paginateData(data: any[], pageIndex: number, pageSize: number) {
    const startIndex = pageIndex * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }
}
