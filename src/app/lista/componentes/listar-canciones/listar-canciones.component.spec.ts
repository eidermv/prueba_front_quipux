import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarCancionesComponent } from './listar-canciones.component';

describe('ListarCancionesComponent', () => {
  let component: ListarCancionesComponent;
  let fixture: ComponentFixture<ListarCancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarCancionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarCancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
