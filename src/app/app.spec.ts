import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  it('creates the component', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
