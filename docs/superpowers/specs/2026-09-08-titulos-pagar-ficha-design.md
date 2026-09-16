# Ficha Contas a Pagar (mock FINA050)

Data: 2026-09-08  
Repo: `C:\Users\Beatriz\Documents\GitHub\automacao-financeira`  
Status: aprovado

## Objetivo

Ao clicar em **Incluir**, **Alterar** ou **Visualizar** no browse de Contas a Pagar, a área principal troca a lista pela ficha FINA050 (abas + Dados Gerais), no mesmo espírito do Cadastro de Bancos e do print da ficha Protheus. Continua mock clicável: cabeçalho e menu laterais permanecem; a mesma tela Angular serve `ng serve` e Protheus Web.

## Decisões

- Ficha **substitui o browse** na área principal (não é modal, sem rota `/pagar`)
- Padrão visual da ficha de Bancos: `table.ficha` de **5 colunas**, inputs **nativos** (não `po-input`)
- Só a aba **Dados Gerais** tem campos nesta entrega
- Abas Impostos, Administrativo, Banco, Contábil e Outros **aparecem e são clicáveis**, conteúdo vazio até novo print
- Dados só em memória; recarregar a página restaura o mock inicial
- Lookups (lupa) não consultam cadastro: toast `Mock: Pesquisa {campo}`
- **Outras Ações** na ficha: toast `Mock: Outras Ações` (menu da ficha fora de escopo)
- **Excluir** e demais itens do browse continuam toast mock; esta entrega não grava exclusão

## Navegação

Estado em `TelaAtiva`: `titulos-pagar` (browse) | `titulos-pagar-form` (ficha).

1. **Incluir** → ficha vazia, editável, aba Dados Gerais. Prefixo/Nº/Parcela liberados.
2. **Alterar** sem linha → `Selecione um título.` Com linha → ficha preenchida. Prefixo, Nº Título e Parcela travados.
3. **Visualizar** sem linha → `Selecione um título.` Com linha → ficha somente leitura. **Salvar** não aparece.
4. **Cancelar** → `titulos-pagar`, descarta rascunho.
5. **Salvar** (Incluir/Alterar) → valida; se ok, grava na lista em memória e volta ao browse.
6. Clique em **Títulos** / **Títulos a Pagar** no menu com ficha aberta → volta ao browse (descarta rascunho).
7. **Voltar** no browse → Gerenciador de Boletos.

Título da ficha: **Contas a Pagar** (sem sufixo INCLUIR/ALTERAR). Browse mantém subtítulo FINA050.

## Browse (inalterado)

Toolbar: Incluir, Alterar, Visualizar, Outras Ações (menu FINA050), Voltar.  
Coluna de legenda (aberto / parcial / baixado) e seleção de uma linha.

## Ficha — barra e abas

Direita: **Outras Ações**, **Cancelar**, **Salvar** (Salvar oculto em Visualizar).

Abas: Dados Gerais (ativa ao abrir) · Impostos · Administrativo · Banco · Contábil · Outros.

## Aba Dados Gerais

Grade 5 colunas, campos nativos. `*` = obrigatório no Salvar.

| Linha | Campos |
|---|---|
| 1 | Prefixo · No. Título \* · Parcela · Tipo \* (lupa) · Natureza \* (lupa) |
| 2 | Fornecedor \* (lupa) · Loja \* · Nome Fornece (somente leitura) · DT Emissão \* · Vencimento \* |
| 3 | Vencto Real \* · Vlr. Título \* · Histórico (largo) · Saldo |
| 4 | Moeda (padrão `1`) · Vlr R$ \* (somente leitura) · Taxa moeda (somente leitura, `0,0000`) · Cód. Aprov (lupa) |

Padrões no Incluir:

- DT Emissão = data de contexto do app (`29/03/2025`), não o relógio real
- Vlr. Título e Saldo = `0,00`
- Moeda = `1`; Taxa moeda = `0,0000`
- Ao alterar Vlr. Título, Saldo copia o valor se ainda não foi editado à mão; Vlr R$ copia o valor quando moeda é `1`

Campos com lupa: input de texto + botão de busca. Clique na lupa → `Mock: Pesquisa {rótulo}`.

## Validação no Salvar

Obrigatórios: Nº Título, Tipo, Natureza, Fornecedor, Loja, DT Emissão, Vencimento, Vencto Real, Vlr. Título.

Chave única no Incluir: **prefixo + número + parcela + tipo** (já existente → aviso, ficha permanece).

Alterar atualiza o registro pelo `id`. Aviso se inválido; ficha permanece aberta.

## Modelo

`TituloPagar` ganha: `vencimentoReal`, `historico`, `moeda`, `valorRs`, `taxaMoeda`, `codAprovacao`.  
Mock atual (`p01`–`p07`) preenche os novos campos de forma coerente (vencimento real = vencimento, moeda `1`, valor R$ = valor, taxa `0`, histórico/código vazios). O browse não mostra essas colunas extras.

Lista em `BoletosPage` passa a `signal` (como bancos), para Incluir/Alterar refletirem na grade.

## Técnico

- `app-titulos-pagar-page`: browse + ficha (mesmo componente, `tela` browse/form).
- Lógica pura em `titulos-pagar.logic.ts`: título vazio, validar gravação, incluir, alterar.
- Sem API. Protheus Web: mesmo bundle; `AFINBOL.prw` não muda. Empacotar só depois da UI, se pedido.

## Testes

- Incluir abre ficha com 5 colunas, inputs nativos, abas listadas, aba Dados Gerais visível.
- Outras abas clicáveis e sem campos nesta entrega.
- Alterar/Visualizar sem seleção não abrem ficha.
- Visualizar não mostra Salvar; inputs desabilitados.
- Salvar sem obrigatórios não grava.
- Incluir válido adiciona linha no browse; Cancelar não adiciona.
- Incluir com chave duplicada não grava.
- Alterar atualiza o registro e volta ao browse.

## Fora de escopo

Rotas Angular; persistência SE2; lookups reais; campos das abas Impostos/Administrativo/Banco/Contábil/Outros; menu Outras Ações da ficha; exclusão real; ficha nativa FINA050 no Protheus.
