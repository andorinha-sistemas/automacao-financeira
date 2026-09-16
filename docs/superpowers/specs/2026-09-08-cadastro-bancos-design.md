# Cadastro de Bancos (mock SA6)

Data: 2026-09-08  
Repo: `C:\Users\Beatriz\Documents\GitHub\automacao-financeira`  
Status: aprovado

## Objetivo

Ao clicar em **Cadastrar banco** no menu Ações, a área principal deixa o Gerenciador de Boletos e mostra um cadastro de bancos no mesmo espírito da tela Protheus (browse SA6 + ficha Incluir/Alterar/Visualizar), no visual atual (navy, PO-UI). A mesma tela Angular deve funcionar em **`ng serve` e no Protheus Web** (`U_AFINBOL` → `FwCallApp("automacao-financeira")`), sem cadastro nativo MVC/SA6.

## Decisões

- Troca de conteúdo **na mesma página** (sem rota `/bancos`)
- Cabeçalho e menu Ações **permanecem**
- Browse **e** ficha (não só lista, não só formulário)
- Voltar **e** qualquer outro item do menu devolvem o Gerenciador de Boletos
- Outros itens do menu continuam só com toast `Mock: {ação}`
- Dados só em memória; recarregar a página restaura o mock inicial
- Protheus Web usa o **mesmo** app Angular (`FwCallApp`); não é a tela nativa FINA/MATA de bancos

## Navegação

1. Estado da tela: `boletos` | `bancos-browse` | `bancos-form`.
2. Clique em `cadastra-banco` → `bancos-browse`. Some Filtros Rápidos, painel Bancos, grade Títulos a Receber e Totais. Título da área: **Cadastro de Bancos**.
3. **Voltar** na tela de bancos → `boletos`.
4. Qualquer ação do menu **exceto** `cadastra-banco` → `boletos` + toast Mock.
5. Clicar de novo em **Cadastrar banco** reabre o browse (descarta ficha aberta sem gravar).

## Browse

Tabela PO-UI com colunas: **Código**, **Nome**, **Nome reduzido**, **Agência**, **Conta**.

Mock inicial (alinhado aos bancos já usados no Gerenciador):

| Código | Nome | Nome reduzido | Agência | DV ag. | Conta | DV conta | Moeda |
|---|---|---|---|---|---|---|---|
| 341 | Itaú Unibanco S.A. | Itaú | 0934 | 5 | 12345 | 6 | 1 |
| 033 | Banco Santander (Brasil) S.A. | Santander | 2271 | 0 | 01020304 | 5 | 1 |
| 001 | Banco do Brasil S.A. | Banco Brasil | 1607 | 1 | 99887 | 3 | 1 |
| 422 | Banco Safra S.A. | Safra | 0012 | 8 | 556677 | 1 | 1 |
| 237 | Banco Bradesco S.A. | Bradesco | 3390 | 2 | 112233 | 4 | 1 |
| 104 | Caixa Econômica Federal | Caixa | 0123 | 0 | 00044889 | 7 | 1 |

Campo **Pesquisar** filtra por código, nome, nome reduzido, agência ou conta.

Botões: **Incluir**, **Alterar**, **Visualizar**, **Excluir**, **Voltar**. Uma linha pode estar selecionada.

## Ficha

Substitui o browse na área principal (não é modal).

Campos: Código, Nome, Nome reduzido, Agência, DV agência, Conta, DV conta, Moeda.

- **Incluir:** ficha vazia, campos editáveis. Confirmar grava na lista e volta ao browse. Cancelar volta ao browse sem gravar.
- **Alterar:** exige linha selecionada; senão aviso. Ficha preenchida e editável. Código não pode ser alterado. Confirmar atualiza o registro.
- **Visualizar:** exige seleção; senão aviso. Ficha somente leitura. Só botão Voltar/Fechar.
- **Excluir:** exige seleção; senão aviso. Confirmação; remove só na memória da sessão.

Validação ao gravar Incluir/Alterar: Código e Nome obrigatórios; Código único (no Incluir).

## Técnico

- Componente `app-bancos-page` (browse + ficha) na área `shell__main`.
- `BoletosPage` guarda `telaAtiva` e a lista de bancos em signals.
- Sem API e sem persistência (recarregar restaura o mock).
- Protheus Web: o mesmo bundle Angular empacotado em `protheus/resource/automacao-financeira.app` e aberto por `U_AFINBOL`. Depois da UI, rodar `npm run package:protheus` e recompilar o `.app` no TDS (servidor **localhost:1002**, env **top2610**). `AFINBOL.prw` não muda.

## Testes

- Cadastrar banco troca a área (some “Títulos a Receber”, aparece “Cadastro de Bancos”).
- Voltar e um item de menu que não seja Cadastrar banco restauram o Gerenciador.
- Incluir com código/nome válidos adiciona uma linha no browse.
- Excluir com confirmação remove a linha selecionada.
- Alterar/Visualizar/Excluir sem seleção não abrem a ficha.

## Fora de escopo

Rota Angular `/bancos`; visual SmartClient clássico; persistência em banco; demais subitens do menu; leitura/gravação real da tabela SA6.
