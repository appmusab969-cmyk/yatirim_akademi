"""Veri dosyalarını parolayla şifreler (AES-256-GCM, anahtar PBKDF2-HMAC-SHA256).

Biçim (Web Crypto ile birebir uyumlu):
  {"v":1,"alg":"AES-GCM","kdf":"PBKDF2-SHA256","iter":600000,"salt":b64,"iv":b64,"ct":b64}
  ct = şifreli metin + 16 bayt GCM etiketi (Web Crypto'nun beklediği gibi sonda).
Bir çalıştırmadaki tüm dosyalar aynı salt'ı kullanır (istemci anahtarı bir kez türetir); IV her dosyada ayrı ve rastgeledir.
"""
import base64, json, os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

ITER = 600_000
b64 = lambda b: base64.b64encode(b).decode()


class Sifreleyici:
    def __init__(self, parola: str, salt: bytes | None = None, iter_: int = ITER):
        if not parola or len(parola) < 12:
            raise ValueError('DATA_PAROLA en az 12 karakter olmalı')
        self.salt = salt or os.urandom(16)
        self.iter = iter_
        self.anahtar = PBKDF2HMAC(hashes.SHA256(), 32, self.salt, iter_).derive(parola.encode('utf-8'))

    def sifrele(self, veri: dict, ad: str) -> dict:
        iv = os.urandom(12)
        # dosya adı ek doğrulanmış veri (AAD): şifreli dosyalar birbirinin yerine konamaz
        ct = AESGCM(self.anahtar).encrypt(iv, json.dumps(veri, ensure_ascii=False).encode('utf-8'), ad.encode())
        return {'v': 1, 'alg': 'AES-GCM', 'kdf': 'PBKDF2-SHA256', 'iter': self.iter, 'salt': b64(self.salt), 'iv': b64(iv), 'ad': ad, 'ct': b64(ct)}


def coz(zarf: dict, parola: str) -> dict:
    salt = base64.b64decode(zarf['salt'])
    k = PBKDF2HMAC(hashes.SHA256(), 32, salt, zarf['iter']).derive(parola.encode('utf-8'))
    return json.loads(AESGCM(k).decrypt(base64.b64decode(zarf['iv']), base64.b64decode(zarf['ct']), zarf['ad'].encode()))
