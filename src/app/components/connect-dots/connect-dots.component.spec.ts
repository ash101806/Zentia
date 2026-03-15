import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectDotsComponent } from './connect-dots.component';

describe('ConnectDotsComponent', () => {
  let component: ConnectDotsComponent;
  let fixture: ComponentFixture<ConnectDotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectDotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConnectDotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
