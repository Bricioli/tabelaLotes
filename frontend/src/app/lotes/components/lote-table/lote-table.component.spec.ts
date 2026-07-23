import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoteTableComponent } from './lote-table.component';
import { LoteStore } from '../../store/lote.store';
import { LoteRepository } from '../../services/lote.repository';
import { HttpStateService } from '../../store/http-state.service';

describe('LoteTableComponent', () => {
  let fixture: ComponentFixture<LoteTableComponent>;
  let component: LoteTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteTableComponent, HttpClientTestingModule],
      providers: [LoteStore, LoteRepository, HttpStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the table component', () => {
    expect(component).toBeTruthy();
  });
});
