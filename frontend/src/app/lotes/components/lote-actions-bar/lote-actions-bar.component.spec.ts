import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoteActionsBarComponent } from './lote-actions-bar.component';
import { LoteStore } from '../../store/lote.store';
import { LoteRepository } from '../../services/lote.repository';
import { HttpStateService } from '../../store/http-state.service';

describe('LoteActionsBarComponent', () => {
  let fixture: ComponentFixture<LoteActionsBarComponent>;
  let component: LoteActionsBarComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteActionsBarComponent, HttpClientTestingModule],
      providers: [LoteStore, LoteRepository, HttpStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteActionsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the actions bar component', () => {
    expect(component).toBeTruthy();
  });
});
