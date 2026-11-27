#!/usr/bin/env python3
"""
Cek masa aktif domain & sertifikat SSL untuk banyak domain sekaligus.

Dipakai untuk validasi concierge: orang kirim daftar domain, kamu balas tabelnya.
Belum produk — ini alat manual untuk dijalankan di laptop sendiri.

Pakai:
    python3 cek-domain.py domain1.com domain2.id
    python3 cek-domain.py -f daftar.txt
    python3 cek-domain.py -f daftar.txt --csv hasil.csv

Hanya pustaka bawaan Python. Semua data yang diambil bersifat publik
(RDAP + sertifikat TLS), jadi tidak perlu verifikasi kepemilikan.
"""

import argparse
import csv
import json
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

RDAP_URL = "https://rdap.org/domain/{}"
UA = "cek-domain/0.1 (alat cek masa aktif domain; kontak via pemilik skrip)"
TIMEOUT = 12
JEDA = 1.0  # jeda antar domain, supaya tidak kena rate limit registry

# RDAP hanya melayani domain terdaftar, bukan subdomain. Kalau orang menempel
# "www.klien.co.id", kita perlu memangkas ke "klien.co.id" — tapi jangan sampai
# kebablasan memangkas jadi "co.id" (itu sufiks registry, bukan domain).
# Daftar pendek ini menggantikan Public Suffix List untuk pemakaian manual.
# Tahap 2 wajib pakai PSL sungguhan — lihat ../docs/rilis-1.md.
SUFIKS_MAJEMUK = {
    "co.id", "or.id", "go.id", "ac.id", "sch.id", "net.id", "web.id",
    "my.id", "biz.id", "desa.id", "ponpes.id", "mil.id",
    "co.uk", "org.uk", "ac.uk", "com.au", "com.sg", "com.my", "co.jp",
}


def kandidat_induk(domain):
    """Daftar nama yang layak dicoba di RDAP, dari paling spesifik ke induknya.

    www.klien.co.id -> ['www.klien.co.id', 'klien.co.id']
    blog.toko.com   -> ['blog.toko.com', 'toko.com']
    """
    bagian = domain.split(".")
    hasil = [domain]
    while len(bagian) > 2:
        sisa = bagian[1:]
        # berhenti sebelum memangkas jadi sufiks registry semata
        if len(sisa) == 2 and ".".join(sisa) in SUFIKS_MAJEMUK:
            break
        bagian = sisa
        hasil.append(".".join(bagian))
    return hasil


def _parse_waktu(teks):
    """RDAP memakai ISO 8601, kadang dengan 'Z' atau pecahan detik."""
    if not teks:
        return None
    teks = teks.strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(teks)
    except ValueError:
        for fmt in ("%Y-%m-%dT%H:%M:%S%z", "%Y-%m-%d"):
            try:
                dt = datetime.strptime(teks, fmt)
                break
            except ValueError:
                continue
        else:
            return None
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _rdap_satu(domain):
    """Satu permintaan RDAP. Mengembalikan (data, galat)."""
    req = urllib.request.Request(RDAP_URL.format(domain), headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            return json.load(resp), None
    except urllib.error.HTTPError as e:
        return None, f"RDAP {e.code}"
    except Exception as e:
        return None, f"RDAP gagal: {type(e).__name__}"


def cek_domain(domain, jeda=JEDA):
    """Ambil tanggal kedaluwarsa & registrar lewat RDAP.

    Kalau yang diberikan subdomain, otomatis mundur ke domain induknya.
    """
    data = galat = None
    dipakai = domain
    kandidat = kandidat_induk(domain)
    for i, nama in enumerate(kandidat):
        if i:
            time.sleep(jeda)  # tetap sopan ke registry saat mencoba induknya
        data, galat = _rdap_satu(nama)
        if data is not None:
            dipakai = nama
            break
    if data is None:
        return None, None, galat

    catatan = None if dipakai == domain else f"dicek sebagai {dipakai}"

    kedaluwarsa = None
    for ev in data.get("events", []):
        if ev.get("eventAction") == "expiration":
            kedaluwarsa = _parse_waktu(ev.get("eventDate"))
            break

    registrar = None
    for ent in data.get("entities", []):
        if "registrar" in ent.get("roles", []):
            for item in ent.get("vcardArray", [[], []])[1]:
                if item[0] == "fn":
                    registrar = item[3]
                    break
            if registrar:
                break

    pesan = [catatan] if catatan else []
    if not kedaluwarsa:
        pesan.append("tanggal tidak tersedia (diredaksi?)")
    return kedaluwarsa, registrar, "; ".join(pesan) or None


def cek_ssl(domain):
    """Ambil tanggal kedaluwarsa sertifikat lewat handshake TLS."""
    ctx = ssl.create_default_context()
    try:
        with socket.create_connection((domain, 443), timeout=TIMEOUT) as sock:
            with ctx.wrap_socket(sock, server_hostname=domain) as ssock:
                cert = ssock.getpeercert()
    except ssl.SSLCertVerificationError as e:
        return None, None, f"sertifikat tidak valid: {e.verify_message}"
    except socket.timeout:
        return None, None, "timeout"
    except Exception as e:
        return None, None, f"gagal: {type(e).__name__}"

    habis = _parse_waktu(
        datetime.strptime(cert["notAfter"], "%b %d %H:%M:%S %Y %Z")
        .replace(tzinfo=timezone.utc).isoformat()
    )
    penerbit = dict(x[0] for x in cert.get("issuer", ())).get("organizationName")
    return habis, penerbit, None


def sisa_hari(dt, sekarang):
    return None if dt is None else (dt - sekarang).days


def status(hari):
    if hari is None:
        return "?"
    if hari < 0:
        return "LEWAT"
    if hari <= 7:
        return "KRITIS"
    if hari <= 30:
        return "SEGERA"
    return "aman"


def main():
    p = argparse.ArgumentParser(description="Cek masa aktif domain & SSL.")
    p.add_argument("domain", nargs="*", help="domain yang dicek")
    p.add_argument("-f", "--file", help="file berisi satu domain per baris")
    p.add_argument("--csv", help="simpan hasil ke file CSV")
    p.add_argument("--jeda", type=float, default=JEDA, help="jeda antar domain (detik)")
    args = p.parse_args()

    daftar = list(args.domain)
    if args.file:
        with open(args.file, encoding="utf-8") as fh:
            daftar += [b.strip() for b in fh if b.strip() and not b.startswith("#")]

    # bersihkan: buang skema & path kalau orang menempel URL penuh
    bersih = []
    for d in daftar:
        d = d.strip().lower()
        d = d.split("//")[-1].split("/")[0].split(":")[0]
        if d and d not in bersih:
            bersih.append(d)

    if not bersih:
        p.error("tidak ada domain. Beri argumen atau pakai -f daftar.txt")

    sekarang = datetime.now(timezone.utc)
    hasil = []

    for i, domain in enumerate(bersih, 1):
        print(f"  [{i}/{len(bersih)}] {domain} ...", file=sys.stderr, flush=True)
        exp_dom, registrar, galat_dom = cek_domain(domain, args.jeda)
        exp_ssl, penerbit, galat_ssl = cek_ssl(domain)
        hasil.append({
            "domain": domain,
            "domain_kedaluwarsa": exp_dom.date().isoformat() if exp_dom else "",
            "domain_sisa_hari": sisa_hari(exp_dom, sekarang),
            "registrar": registrar or "",
            "ssl_kedaluwarsa": exp_ssl.date().isoformat() if exp_ssl else "",
            "ssl_sisa_hari": sisa_hari(exp_ssl, sekarang),
            "penerbit_ssl": penerbit or "",
            "catatan": "; ".join(x for x in (galat_dom, galat_ssl) if x),
        })
        if i < len(bersih):
            time.sleep(args.jeda)

    # urutkan: yang paling cepat kedaluwarsa di atas
    hasil.sort(key=lambda r: (
        r["domain_sisa_hari"] if r["domain_sisa_hari"] is not None else 10**6
    ))

    lebar = max(len(r["domain"]) for r in hasil)
    print()
    print(f"{'DOMAIN':<{lebar}}  {'DOMAIN EXP':<12} {'SISA':>6}  "
          f"{'SSL EXP':<12} {'SISA':>6}  STATUS")
    print("-" * (lebar + 54))
    for r in hasil:
        sd, ss = r["domain_sisa_hari"], r["ssl_sisa_hari"]
        paling_mendesak = min([x for x in (sd, ss) if x is not None], default=None)
        print(
            f"{r['domain']:<{lebar}}  "
            f"{r['domain_kedaluwarsa'] or '-':<12} {('-' if sd is None else sd):>6}  "
            f"{r['ssl_kedaluwarsa'] or '-':<12} {('-' if ss is None else ss):>6}  "
            f"{status(paling_mendesak)}"
            + (f"   ({r['catatan']})" if r["catatan"] else "")
        )

    if args.csv:
        with open(args.csv, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(hasil[0].keys()))
            w.writeheader()
            w.writerows(hasil)
        print(f"\nTersimpan: {args.csv}")


if __name__ == "__main__":
    main()
