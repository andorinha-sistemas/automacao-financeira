import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  it('creates the component with a router-outlet and no PoMenu', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(fixture.componentInstance).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
    expect(compiled.querySelector('po-menu')).toBeNull();
    expect(compiled.querySelector('po-toolbar')).toBeNull();
  });
});
