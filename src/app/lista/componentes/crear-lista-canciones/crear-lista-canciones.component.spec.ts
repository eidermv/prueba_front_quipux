import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearListaCancionesComponent } from './crear-lista-canciones.component';

describe('CrearListaCancionesComponent', () => {
  let component: CrearListaCancionesComponent;
  let fixture: ComponentFixture<CrearListaCancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearListaCancionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearListaCancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
