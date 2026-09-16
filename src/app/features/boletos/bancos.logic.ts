import { BancoCadastro, ModoFichaBanco } from './boletos.model';

export function bancoVazio(): BancoCadastro {
  return {
    id: '',
    filial: '',
    codigo: '',
    agencia: '',
    dvAgencia: '',
    conta: '',
    dvConta: '',
    nome: '',
    nomeReduzido: '',
    bairro: '',
    municipio: '',
    cep: '',
    endereco: '',
    fax: '',
    telex: '',
    estado: '',
    telefone: '',
    caixaPostal: '',
    limCredito: '0,00',
    moeda: '1',
    contato: '',
    diasRetencao: '0',
    paisBanco: '',
    correntista: '',
    fornecedor: '',
    cliente: '',
    lojaCliente: '',
    bloqueado: '2',
    dtBloqueio: '',
    titularidade: '2',
    lojaFornec: '',
    cpfCnpj: '',
    bcoOficial: '',
    paisConta: '',
    codIspb: '',
    codCedente: '',
    multaPix: '0,00',
    diasExpPix: '0',
    retDesconto: '0',
    saldoAtual: '0,00',
    txCobSimpl: '0,00',
    taxaDesconto: '0,00',
    contaContabil: '',
    entidadeFin: '',
    nroBanco: '',
    identExport: '',
    dadosIntern: '',
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
    integra: '2',
    cntTechFin: '2',
    idTechFin: '',
  };
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

export function filtrarBancos(bancos: BancoCadastro[], busca: string): BancoCadastro[] {
  const q = norm(busca);
  if (!q) {
    return bancos;
  }
  return bancos.filter((b) =>
    [b.filial, b.codigo, b.nome, b.nomeReduzido, b.agencia, b.conta].some((v) => norm(v).includes(q)),
  );
}

export function validarGravacaoBanco(
  banco: BancoCadastro,
  lista: BancoCadastro[],
  modo: ModoFichaBanco,
): { ok: true } | { ok: false; erro: string } {
  if (!banco.codigo.trim() || !banco.nome.trim() || !banco.agencia.trim() || !banco.conta.trim()) {
    return { ok: false, erro: 'Informe o código, o nome, a agência e a conta do banco.' };
  }
  if (
    modo === 'incluir' &&
    lista.some(
      (b) =>
        b.codigo.trim() === banco.codigo.trim() &&
        b.agencia.trim() === banco.agencia.trim() &&
        b.conta.trim() === banco.conta.trim(),
    )
  ) {
    return { ok: false, erro: 'Já existe um banco com este código, agência e conta.' };
  }
  return { ok: true };
}

export function incluirBanco(lista: BancoCadastro[], banco: BancoCadastro): BancoCadastro[] {
  return [...lista, { ...banco, codigo: banco.codigo.trim() }];
}

export function alterarBanco(lista: BancoCadastro[], banco: BancoCadastro): BancoCadastro[] {
  return lista.map((b) => (b.codigo === banco.codigo ? { ...banco } : b));
}

export function excluirBanco(lista: BancoCadastro[], codigo: string): BancoCadastro[] {
  return lista.filter((b) => b.codigo !== codigo);
}
