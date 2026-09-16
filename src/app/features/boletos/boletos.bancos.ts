import { BancoCodigo } from './boletos.model';

export const BANCO_ICONS: Record<string, string> = {
  itau: 'assets/bancos/itau.png',
  santander: 'assets/bancos/santander.png',
  bb: 'assets/bancos/bb.png',
  safra: 'assets/bancos/safra.png',
  bradesco: 'assets/bancos/bradesco.png',
  caixa: 'assets/bancos/caixa.png',
};

export const BANCO_NOMES: Record<string, string> = {
  itau: 'Itaú',
  santander: 'Santander',
  bb: 'Banco Brasil',
  safra: 'Safra',
  bradesco: 'Bradesco',
  caixa: 'Caixa Econômica',
};

export const PORTADOR_BANCO: Record<string, Exclude<BancoCodigo, ''>> = {
  '341': 'itau',
  '033': 'santander',
  '001': 'bb',
  '422': 'safra',
  '237': 'bradesco',
  '104': 'caixa',
};

export function bancoFromPortador(portador: string): BancoCodigo {
  return PORTADOR_BANCO[String(portador ?? '').trim()] ?? '';
}
