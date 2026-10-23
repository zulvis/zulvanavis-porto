# Menyiapkan backend Ask AI

Worker ini terpisah dari website statis. Ia membaca halaman portofolio publik terbaru (cache 10 menit), memilih halaman yang relevan, lalu membuat jawaban dengan Workers AI.

## Hubungkan Worker yang sudah dibuat ke kode ini

1. Unggah folder `cloudflare/ask-ai` ke repository GitHub portofolio.
2. Di Worker `zulvanavis-ask-ai-porto`, buka **Settings → Builds → Connect** dan hubungkan repository `zulvis/zulvanavis-porto`.
3. Atur production branch ke `main`, **Root directory** ke `/cloudflare/ask-ai`, **Build command** ke `None`, dan **Deploy command** ke `npx wrangler deploy`.
4. Simpan pengaturan dan jalankan deployment. Nama Worker pada dashboard harus sama persis dengan nilai `name` di `wrangler.jsonc`. File itu juga sudah mendefinisikan binding Workers AI bernama `AI`; Worker tidak mengunggah website sebagai aset.
5. Pastikan `https://zulvanavis-ask-ai-porto.dokumennafis.workers.dev/health` menampilkan `{"ok":true,...}`.

Jangan memilih **Upload your static files** atau mengatur root ke `/` maupun `/ask`: direktori backend khususnya adalah `/cloudflare/ask-ai`.

## Penggunaan dan biaya

Worker menggunakan model `@cf/google/gemma-4-26b-a4b-it`. Workers AI menyediakan alokasi harian gratis; jika penggunaan melewati alokasi tersebut, Workers Paid diperlukan dan pemakaian tambahan ditagih. Periksa dashboard usage Cloudflare secara berkala. Batas permintaan per IP dalam kode bersifat best-effort karena memori Worker dapat berubah antar-isolate.
