import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoteFilterFormComponent } from './lote-filter-form.component';
import { LoteStore } from '../../store/lote.store';
import { LoteRepository } from '../../services/lote.repository';
import { HttpStateService } from '../../store/http-state.service';

describe('LoteFilterFormComponent', () => {
  let fixture: ComponentFixture<LoteFilterFormComponent>;
  let component: LoteFilterFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteFilterFormComponent, HttpClientTestingModule],
      providers: [LoteStore, LoteRepository, HttpStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the filter component', () => {
    expect(component).toBeTruthy();
  });
});
