import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { AcaoSidebar } from '../../boletos.model';
import { ActionSidebar } from './action-sidebar';

const ACTIONS: AcaoSidebar[] = [
  { id: 'retorno-api', label: 'Retorno API' },
  {
    id: 'titulos',
    label: 'Títulos',
    children: [
      { id: 'baixar-titulo', label: 'Baixar Título' },
    ],
  },
  {
    id: 'boletos',
    label: 'Boletos',
    children: [{ id: 'gerar-boleto', label: 'Gerar Boleto' }],
  },
  {
    id: 'bancos',
    label: 'Bancos',
    children: [{ id: 'cadastra-banco', label: 'Cadastrar banco' }],
  },
  {
    id: 'cliente-grupo',
    label: 'Cliente',
    children: [{ id: 'cliente', label: 'Cliente' }],
  },
];


describe('ActionSidebar', () => {
  async function render() {
    await TestBed.configureTestingModule({
      imports: [ActionSidebar],
    }).compileComponents();
    const fixture = TestBed.createComponent(ActionSidebar);
    fixture.componentRef.setInput('actions', ACTIONS);
    fixture.detectChanges();
    return fixture;
  }

  it('hides group children until the group is clicked', async () => {
    const fixture = await render();
    const sidebar = fixture.nativeElement as HTMLElement;
    expect(sidebar.textContent).toContain('Retorno API');
    expect(sidebar.textContent).toContain('Títulos');
    expect(sidebar.textContent).toContain('Boletos');
    expect(sidebar.textContent).not.toContain('Baixar Título');
    expect(sidebar.textContent).not.toContain('Gerar Boleto');

    const titulos = sidebar.querySelector('[data-group="titulos"]') as HTMLButtonElement;
    titulos.click();
    fixture.detectChanges();
    expect(sidebar.textContent).toContain('Baixar Título');
    expect(sidebar.textContent).not.toContain('Gerar Boleto');
  });

  it('keeps a second group open after another is expanded', async () => {
    const fixture = await render();
    const sidebar = fixture.nativeElement as HTMLElement;
    (sidebar.querySelector('[data-group="titulos"]') as HTMLButtonElement).click();
    (sidebar.querySelector('[data-group="boletos"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(sidebar.textContent).toContain('Baixar Título');
    expect(sidebar.textContent).toContain('Gerar Boleto');
  });

  it('expands groups without emitting and still emits the leaf subitem', async () => {
    const fixture = await render();
    const emitted: string[] = [];
    fixture.componentInstance.acao.subscribe((action) => emitted.push(action.id));

    const sidebar = fixture.nativeElement as HTMLElement;
    (sidebar.querySelector('[data-group="titulos"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(emitted).toEqual([]);
    expect(sidebar.textContent).toContain('Baixar Título');

    const boletos = sidebar.querySelector('[data-group="boletos"]') as HTMLButtonElement;
    boletos.click();
    fixture.detectChanges();
    expect(emitted).toEqual([]);

    const bancos = sidebar.querySelector('[data-group="bancos"]') as HTMLButtonElement;
    bancos.click();
    fixture.detectChanges();
    expect(emitted).toEqual([]);

    const clientes = sidebar.querySelector('[data-group="cliente-grupo"]') as HTMLButtonElement;
    clientes.click();
    fixture.detectChanges();
    expect(emitted).toEqual([]);

    const child = [...sidebar.querySelectorAll('button')].find((btn) =>
      btn.textContent?.includes('Baixar Título'),
    );
    child?.click();
    fixture.detectChanges();
    expect(emitted).toEqual(['baixar-titulo']);
  });

  it('collapses the menu and expands it again from the toggle', async () => {
    const fixture = await render();
    const sidebar = fixture.nativeElement as HTMLElement;
    const toggle = sidebar.querySelector('[data-toggle-sidebar]') as HTMLButtonElement;
    expect(toggle).toBeTruthy();
    expect(sidebar.textContent).toContain('Automação Financeira');
    expect(sidebar.textContent).toContain('Fechar menu');
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(sidebar.textContent).not.toContain('Automação Financeira');
    expect(sidebar.textContent).not.toContain('Títulos');
    expect(sidebar.textContent).not.toContain('Fechar menu');
    expect(sidebar.classList.contains('recolhido')).toBe(true);

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar.textContent).toContain('Automação Financeira');
    expect(sidebar.textContent).toContain('Títulos');
    expect(sidebar.classList.contains('recolhido')).toBe(false);
  });
});
