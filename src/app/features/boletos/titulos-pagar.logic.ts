import { ModoFicha, TituloPagar } from './boletos.model';

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filtrarTitulosPagar(titulos: TituloPagar[], busca: string): TituloPagar[] {
  const q = norm(busca);
  if (!q) {
    return titulos ?? [];
  }
  return (titulos ?? []).filter((t) =>
    [t.prefixo, t.numero, t.parcela, t.tipo, t.fornecedor, t.nomeFornecedor, t.natureza].some((v) =>
      norm(v).includes(q),
    ),
  );
}

export function impostosPagarVazios(): Pick<
  TituloPagar,
  | 'iss'
  | 'irrf'
  | 'inss'
  | 'comDet'
  | 'cdRetencao'
  | 'sestSenat'
  | 'cofins'
  | 'pisPasep'
  | 'csll'
  | 'basePcc'
  | 'vencIss'
  | 'vlrAcServ'
  | 'variacDctf'
  | 'periodDctf'
  | 'formRetIss'
  | 'aplicVlMin'
  | 'codAliqIss'
  | 'baseIss'
  | 'baseIrpf'
  | 'cide'
  | 'baseInss'
  | 'codRetInss'
  | 'percCide'
  | 'idDarf'
  | 'provInss'
  | 'provIss'
  | 'percFabov'
  | 'vlFabov'
  | 'percFacs'
  | 'vlFacs'
  | 'vlFamad'
  | 'vlFumipeq'
  | 'percFamad'
  | 'percFumipeq'
  | 'issRetido'
  | 'codServIss'
  | 'percIma'
  | 'valorIma'
> {
  return {
    iss: '0,00',
    irrf: '0,00',
    inss: '0,00',
    comDet: '2',
    cdRetencao: '',
    sestSenat: '0,00',
    cofins: '0,00',
    pisPasep: '0,00',
    csll: '0,00',
    basePcc: '0,00',
    vencIss: '',
    vlrAcServ: '0,00',
    variacDctf: '0',
    periodDctf: '',
    formRetIss: '1',
    aplicVlMin: '1',
    codAliqIss: '',
    baseIss: '0,00',
    baseIrpf: '0,00',
    cide: '0,00',
    baseInss: '0,00',
    codRetInss: '',
    percCide: '',
    idDarf: '',
    provInss: '0,00',
    provIss: '0,00',
    percFabov: '',
    vlFabov: '0,00',
    percFacs: '',
    vlFacs: '0,00',
    vlFamad: '0,00',
    vlFumipeq: '0,00',
    percFamad: '',
    percFumipeq: '',
    issRetido: '0,00',
    codServIss: '',
    percIma: '',
    valorIma: '0,00',
  };
}

export function administrativoPagarVazios(): Pick<
  TituloPagar,
  | 'taxaPerman'
  | 'porcJuros'
  | 'acrescimo'
  | 'fluxoCaixa'
  | 'desdobramento'
  | 'aprovador'
  | 'decrescimo'
  | 'multNatur'
  | 'txCorMoeda'
  | 'dtSuspensao'
  | 'possuiDesc'
  | 'noSolicitacao'
> {
  return {
    taxaPerman: '0,00',
    porcJuros: '0,00',
    acrescimo: '0,00',
    fluxoCaixa: 'S',
    desdobramento: 'N',
    aprovador: '',
    decrescimo: '0,00',
    multNatur: '2',
    txCorMoeda: '0,0000',
    dtSuspensao: '',
    possuiDesc: '2',
    noSolicitacao: '',
  };
}

export function bancoPagarVazios(): Pick<
  TituloPagar,
  | 'portador'
  | 'modPagto'
  | 'codBarras'
  | 'dataAgend'
  | 'linhaDig'
  | 'bancoFor'
  | 'agenciaFor'
  | 'dvAgenciaFor'
  | 'contaFor'
  | 'dvContaFor'
  | 'formaPgto'
> {
  return {
    portador: '',
    modPagto: '1',
    codBarras: '',
    dataAgend: '',
    linhaDig: '',
    bancoFor: '',
    agenciaFor: '',
    dvAgenciaFor: '',
    contaFor: '',
    dvContaFor: '',
    formaPgto: '',
  };
}

export function contabilPagarVazios(): Pick<
  TituloPagar,
  'rateio' | 'ctaContabil' | 'seqDiario' | 'codDiario' | 'cCusto'
> {
  return {
    rateio: 'N',
    ctaContabil: '',
    seqDiario: '',
    codDiario: '',
    cCusto: '',
  };
}

export function outrosPagarVazios(): Pick<
  TituloPagar,
  | 'rateioProj'
  | 'codOrcam'
  | 'numContrato'
  | 'revisaoCont'
  | 'numPlanilha'
  | 'numCronogr'
  | 'numParcelaCtr'
  | 'codRda'
  | 'bonificCtr'
  | 'retencaoCtr'
  | 'multaCtr'
  | 'descontoCtr'
  | 'procJudic'
  | 'tpProcesso'
  | 'codOperad'
  | 'nomeOperad'
  | 'itemContab'
  | 'retInss'
  | 'cnpjRet'
  | 'descP100'
  | 'classeValor'
  | 'dtApuracao'
  | 'entDeb05'
  | 'entCred05'
  | 'entDeb06'
  | 'entCred06'
  | 'entDeb07'
  | 'entCred07'
  | 'entDeb08'
  | 'entCred08'
  | 'entDeb09'
  | 'entCred09'
  | 'referencia'
  | 'numMedicao'
  | 'vlrRetIss'
> {
  return {
    rateioProj: '2',
    codOrcam: '',
    numContrato: '',
    revisaoCont: '',
    numPlanilha: '',
    numCronogr: '',
    numParcelaCtr: '',
    codRda: '',
    bonificCtr: '0,00',
    retencaoCtr: '0,00',
    multaCtr: '0,00',
    descontoCtr: '0,00',
    procJudic: '',
    tpProcesso: '',
    codOperad: '',
    nomeOperad: '',
    itemContab: '',
    retInss: '',
    cnpjRet: '',
    descP100: '0',
    classeValor: '',
    dtApuracao: '',
    entDeb05: '',
    entCred05: '',
    entDeb06: '',
    entCred06: '',
    entDeb07: '',
    entCred07: '',
    entDeb08: '',
    entCred08: '',
    entDeb09: '',
    entCred09: '',
    referencia: '',
    numMedicao: '',
    vlrRetIss: '0,00',
  };
}

export function tituloPagarVazio(): TituloPagar {
  return {
    id: '',
    filial: '0101',
    prefixo: '',
    numero: '',
    parcela: '',
    tipo: '',
    natureza: '',
    fornecedor: '',
    loja: '',
    nomeFornecedor: '',
    emissao: '29/03/2025',
    vencimento: '',
    vencimentoReal: '',
    valor: 0,
    saldo: 0,
    historico: '',
    moeda: '1',
    valorRs: 0,
    taxaMoeda: 0,
    codAprovacao: '',
    ...impostosPagarVazios(),
    ...administrativoPagarVazios(),
    ...bancoPagarVazios(),
    ...contabilPagarVazios(),
    ...outrosPagarVazios(),
  };
}

export function chaveTituloPagar(titulo: TituloPagar): string {
  return [titulo.prefixo, titulo.numero, titulo.parcela, titulo.tipo].map(norm).join('|');
}

const OBRIGATORIOS: Array<keyof TituloPagar> = [
  'numero',
  'tipo',
  'natureza',
  'fornecedor',
  'loja',
  'emissao',
  'vencimento',
  'vencimentoReal',
];

export function validarGravacaoTituloPagar(
  titulo: TituloPagar,
  lista: TituloPagar[],
  modo: ModoFicha,
): { ok: true } | { ok: false; erro: string } {
  if (OBRIGATORIOS.some((campo) => !String(titulo[campo] ?? '').trim())) {
    return { ok: false, erro: 'Preencha os campos obrigatórios.' };
  }
  if (modo === 'incluir' && lista.some((item) => chaveTituloPagar(item) === chaveTituloPagar(titulo))) {
    return { ok: false, erro: 'Já existe um título com este prefixo, número, parcela e tipo.' };
  }
  return { ok: true };
}

function proximoId(lista: TituloPagar[]): string {
  const n = lista.reduce((max, t) => {
    const m = /^p(\d+)$/.exec(t.id);
    return m ? Math.max(max, Number(m[1])) : max;
  }, 0);
  return `p${String(n + 1).padStart(2, '0')}`;
}

export function incluirTituloPagar(lista: TituloPagar[], titulo: TituloPagar): TituloPagar[] {
  return [...lista, { ...titulo, id: proximoId(lista) }];
}

export function alterarTituloPagar(lista: TituloPagar[], titulo: TituloPagar): TituloPagar[] {
  return lista.map((item) => (item.id === titulo.id ? { ...titulo } : item));
}
