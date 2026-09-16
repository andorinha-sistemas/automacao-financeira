import { bancoFromPortador } from './boletos.bancos';
import { bancoVazio } from './bancos.logic';
import { BancoCadastro, TituloReceber } from './boletos.model';

export interface BankApiItem {
  filial?: string;
  codigo?: string;
  agencia?: string;
  conta?: string;
  nome?: string;
  reduzido?: string;
  cnpj?: string;
}

export interface ReceivableApiItem {
  filial?: string;
  prefixo?: string;
  num?: string;
  parcela?: string;
  tipo?: string;
  natureza?: string;
  cliente?: string;
  loja?: string;
  nomcli?: string;
  emissao?: string;
  vencto?: string;
  vencrea?: string;
  valor?: number;
  saldo?: number;
  historico?: string;
  portador?: string;
}

export function aaaammddToBr(raw: string): string {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (digits.length !== 8) {
    return String(raw ?? '');
  }
  return `${digits.slice(6, 8)}/${digits.slice(4, 6)}/${digits.slice(0, 4)}`;
}

export function brToIso(raw: string): string {
  const [dd, mm, yyyy] = String(raw ?? '').split('/');
  if (!yyyy || !mm || !dd) {
    return String(raw ?? '');
  }
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function parseBrDate(raw: string): Date | null {
  const [dd, mm, yyyy] = String(raw ?? '').split('/');
  if (!yyyy || !mm || !dd) {
    return null;
  }
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function bancoFromApi(item: BankApiItem): BancoCadastro {
  const filial = String(item.filial ?? '').trim();
  const codigo = String(item.codigo ?? '').trim();
  const agencia = String(item.agencia ?? '').trim();
  const conta = String(item.conta ?? '').trim();
  return {
    ...bancoVazio(),
    id: `${filial}|${codigo}|${agencia}|${conta}`,
    filial,
    codigo,
    agencia,
    conta,
    nome: String(item.nome ?? '').trim(),
    nomeReduzido: String(item.reduzido ?? '').trim(),
    cpfCnpj: String(item.cnpj ?? '').trim(),
  };
}

export function bancoToApiBody(banco: BancoCadastro): Record<string, string> {
  const body: Record<string, string> = {
    a6_cod: banco.codigo.trim(),
    a6_agencia: banco.agencia.trim(),
    a6_numcon: banco.conta.trim(),
    a6_nome: banco.nome.trim(),
  };
  const opcionais: Array<[string, string]> = [
    ['a6_nreduz', banco.nomeReduzido],
    ['a6_dvage', banco.dvAgencia],
    ['a6_dvcta', banco.dvConta],
    ['a6_est', banco.estado],
    ['a6_cgc', banco.cpfCnpj],
    ['a6_mun', banco.municipio],
    ['a6_bairro', banco.bairro],
    ['a6_end', banco.endereco],
    ['a6_cep', banco.cep],
    ['a6_tel', banco.telefone],
    ['a6_fax', banco.fax],
  ];
  for (const [campo, valor] of opcionais) {
    if (valor.trim()) {
      body[campo] = valor.trim();
    }
  }
  return body;
}

export function tituloReceberFromApi(item: ReceivableApiItem): TituloReceber {
  const valor = Number(item.valor) || 0;
  const saldo = Number(item.saldo) || 0;
  const vencimento = aaaammddToBr(item.vencto ?? '');
  const vencimentoDate = parseBrDate(vencimento);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const portador = String(item.portador ?? '').trim();
  return {
    id: `${item.prefixo ?? ''}|${item.num ?? ''}|${item.parcela ?? ''}|${item.tipo ?? ''}`,
    filial: String(item.filial ?? '').trim(),
    prefixo: String(item.prefixo ?? '').trim(),
    numero: String(item.num ?? '').trim(),
    parcela: String(item.parcela ?? '').trim(),
    tipo: String(item.tipo ?? '').trim(),
    natureza: String(item.natureza ?? '').trim(),
    portador,
    banco: bancoFromPortador(portador),
    cliente: String(item.cliente ?? '').trim(),
    loja: String(item.loja ?? '').trim(),
    nomeCliente: String(item.nomcli ?? '').trim(),
    emissao: aaaammddToBr(item.emissao ?? ''),
    vencimento,
    vencimentoReal: aaaammddToBr(item.vencrea ?? item.vencto ?? ''),
    valor,
    irrf: 0,
    status: saldo <= 0 ? 'baixado' : saldo < valor ? 'parcBaixado' : 'aberto',
    bordero: false,
    adiantamento: false,
    conciliado: false,
    alerta: false,
    atrasado: Boolean(vencimentoDate && vencimentoDate < hoje && saldo > 0),
  };
}

export function mensagemApi(err: unknown): string {
  const e = err as { error?: { message?: string }; message?: string };
  return e?.error?.message || e?.message || 'Falha ao consultar a API.';
}
