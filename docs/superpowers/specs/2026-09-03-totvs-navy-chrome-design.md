# Chrome navy TOTVS — Gerenciador de Boletos

Data: 2026-09-03  
Repo: `C:\Users\Beatriz\Documents\GitHub\automacao-financeira`  
Status: aprovado

## Objetivo

Modernizar só a **casca** do mock com a marca nova da TOTVS (pack de assets) e tokens Animalia/PO-UI. Componentes PO-UI da grade, filtros e totais permanecem.

## Decisões

- Recorte **A**: casca + marca, sem trocar PO-UI por Web Components Animalia
- Chrome **navy** (`#002233`), acento ciano (`#00dbff`)
- Sem hexágono 3D de fundo
- Sem mudança de layout, dados mock, filtros, totais ou `FwCallApp`

## Visual

| Superfície | Tratamento |
|---|---|
| Header | Navy; logo TOTVS branca + texto “Financeiro”; meta e Sair em claro/ciano |
| Sidebar | Navy; “Automação Financeira” branco; ações PO-UI tertiary com texto branco e hover ciano |
| Main | Fundo cinza claro; cards brancos, raio 8px |
| PO-UI | `--color-brand-01-*` e `--color-action-*` de roxo para navy; ciano em foco/hover |
| Títulos | Fonte TOTVS Bold do pack |
| Corpo/tabela | Fonte do PO-UI/Animalia |

## Arquivos

- `public/assets/brand/` — `logo-totvs-branco.svg`, `TOTVS-Bold.ttf`
- `src/styles.css` — `@font-face` + override de tokens PO-UI
- Header, sidebar, shell, filtros, totais, barra da tabela — CSS (e HTML do header)

## Fora de escopo

Trocar `po-table` / `po-checkbox` / `po-button` por Animalia WC; implantar no RPO; alterar lógica do mock.
