// Paket engine — server-only, murni (fungsi + I/O jaringan), tanpa HTTP/DB.
// Ditulis agar bisa diekstrak jadi paket npm bersama bila security-test juga TS
// (lihat ../../../../docs/hubungan-proyek.md).
export { normalize, cleanInput, type Normalized } from './normalize';
export { rdapLookup, type RdapResult } from './rdap';
export { tlsCheck, tlsCheckWithFallback, type TlsResult } from './tls';
export { daysLeft, statusOf, type Status } from './status';
export { rdapGate } from './ratelimit';
export { checkOne, type DomainCheck } from './check';
