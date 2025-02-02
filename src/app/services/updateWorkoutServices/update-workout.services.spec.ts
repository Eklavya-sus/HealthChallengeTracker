import { TestBed } from '@angular/core/testing';
import { UpdateWorkoutServices } from './updateWorkoutService';

describe('UpdateWorkoutServices', () => {
  let service: UpdateWorkoutServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateWorkoutServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial workouts as an empty array', (done) => {
    service.workouts$.subscribe((workouts) => {
      expect(workouts).toEqual([]);
      done();
    });
  });

  it('should update workouts when updateWorkout is called', (done) => {
    const mockWorkouts = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 15 },
    ];

    service.workouts$.subscribe((workouts) => {
      if (workouts.length > 0) {
        expect(workouts).toEqual(mockWorkouts);
        done();
      }
    });

    service.updateWorkout(mockWorkouts);
  });
});
