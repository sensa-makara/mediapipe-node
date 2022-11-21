# Sensa Makara v2
## Sensa Makara v2, dibuat dengan platform nodejs dan menggunakan modul mediapipe.js
Mengimplementasikan computer vision serta kecerdasan buatan guna memetakan muka manusia dan melakukan pelacakan pada koordinat mata, yang kemudian digunakan untuk menghitung rasio dari mata tersebut guna mendeteksi kedipan.
Kedipan inilah yang kemudian dijadikan input guna memudahkan pengguna dengan disabilitas terutama mereka kelumpuhan motorik seperti penderita ALS untuk berkomunikasi, kedipan digunakan untuk memilih huruf yang ada di layar.
Kemudian Sensa Makara juga telah dilengkapi sistem text recommendation yang mengimplementasikan algoritma text fuzzy search yang mencari kemiripan antara input dengan kamus yang telah disimpan di sistem.
Setelah itu user dapat membentuk kata-kata dan ketika telah selesai dapat membuat Sensa Makara melakukan speech synthesis dan membacakan teks tersebut layaknya seorang manusia.

## How to use locally
Clone repo ini
```bash
git clone https://github.com/sensa-makara/mediapipe-node.git sensa-makara
```

Masuk kedalam folder sensa-makara
```bash
cd sensa-makara
```

Install node dependencies
```bash
npm install
```

Jalankan dev server
```bash
npm run dev
```

Lalu buka url http://localhost:5173 (default) di browser anda
