import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoteManagementPage } from './lote-management-page.component';
import { LoteStore } from '../../store/lote.store';
import { LoteRepository } from '../../services/lote.repository';
import { HttpStateService } from '../../store/http-state.service';

describe('LoteManagementPage', () => {
  let fixture: ComponentFixture<LoteManagementPage>;
  let component: LoteManagementPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteManagementPage, HttpClientTestingModule],
      providers: [LoteStore, LoteRepository, HttpStateService],
    }).compileComponents();

    fixture = TestBed.createComponent(LoteManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the management page', () => {
    expect(component).toBeTruthy();
  });
});
