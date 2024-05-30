# Revou Mini Project Microservices

## 📌 Gambaran Umum

Repositori ini berisi sebuah Microservices untuk menangani proses pembelian barang. Service yang terdapat pada microservices ini antara lain:

1. **Users Service**: Bertanggung jawab untuk otentikasi pengguna seperti login dan register.
2. **Products Service**: Bertanggung jawab untuk mengelola informasi produk serta melakukan operasi CRUD produk
3. **Orders Service**: Bertanggung jawab untuk mengelola informasi pesanan serta pembuatan pesanan
4. **Notifications Service**: Bertanggung jawab untuk mengirimkan notifikasi saat pesanan dibuat

## 📦 Teknologi yang Digunakan

- **Kong**: Teknologi ini digunakan sebagai Gateway API untuk microservices
- **Rabbitmq**: Teknologi ini digunakan untuk melakukan komunikasi antar service pada microservices
- **Postman**: Teknologi ini digunakan untuk mendokumentasikan API pada semua service

- **Express**: Library ini digunakan untuk melakukan pengembangan REST API dengan mudah
- **Typescript**: Library ini digunakan untuk tipe data pada bahasa Javascript
- **Bcrypt**: Library ini digunakan untuk melakukan _hashing_ password
- **Jsonwebtoken**: Library ini digunakan untuk membuat dan memverifikasi token autentikasi
- **Mysql2**: Library ini digunakan untuk berinteraksi dengan database mysql
- **Dotenv**: Library ini digunakan untuk memuat variabel dari file .env
- **Amqplib**: Library ini digunakan untuk melakukan komunikasi dengan Rabbitmq
- **Kafkajs**: Library ini digunakan untuk melakukan komunikasi dengan Kafka

## 📁 Struktur Folder

Terdapat 4 folder services yang digunakan pada microservices ini:

- **notifications**
- **orders**
- **products**
- **users**

Setiap services memliki struktur folder sebagai berikut:

- **src**: Direktori ini menyimpan semua kode untuk REST API.
  - **consumer**: Folder ini berisi fungsi untuk mengirim atau menerima _queue_ dari Rabbitmq
  - **controllers**: Folder ini berisi kontroler untuk menangani permintaan masuk, memprosesnya, dan mengembalikan respons yang sesuai
  - **services**: Folder ini berisi layanan untuk mengimplentasi logika bisnis
  - **repositories**: Folder ini berisi repositori untuk melakukan interkasi dengan model dan melakukan operasi database
  - **models**: Folder ini berisi model data yang mewakili struktur entitas database
  - **middlewares**: Folder ini berisi kode middleware yang digunakan untuk melakukan operasi sebelum diteruskan ke handler rute
  - **routes**: Folder ini berisi definisi rute untuk REST API
  - **lib**: Folder ini berisi file database yang berujuan untuk menghubungkan REST API dengan database
  - **utils**: Folder ini berisi kode untuk utilitas pada REST API
  - **queries**: Folder ini berisi _query_ mysql yang digunakan pasa REST API
  - **app.ts**: File ini berisi konfigurasi utama REST API, yang meliputi kontroler, rute, dan middleware yang digunakan.
  - **controllers.ts**: File ini berisi definisi kontroler dari folder controllers yang akan digunakan untuk REST API
  - **index.ts**: File ini merupakan file utama yang digunakan untuk menjalankan REST API

## 📊 Struktur Database

Database dan tabel yang digunakan pada proyek ini antara lain:

### 1. Database User

#### Tabel `users`

| Column   | Data Type    | Not Null | Auto Increment | Key     | Default |
| -------- | ------------ | -------- | -------------- | ------- | ------- |
| id       | INT          | [✓]      | [✓]            | PRIMARY |         |
| email    | VARCHAR(100) |          |                | UNIQUE  |         |
| password | VARCHAR(200) |          |                |         |         |
| name     | VARCHAR(100) |          |                |         |         |

### 2. Database Product

#### Tabel `products`

| Column   | Data Type    | Not Null | Auto Increment | Key     | Default |
| -------- | ------------ | -------- | -------------- | ------- | ------- |
| id       | INT          | [✓]      | [✓]            | PRIMARY |         |
| name     | VARCHAR(100) |          |                |         |         |
| quantity | INT          |          |                |         |         |
| price    | INT          |          |                |         |         |

### 3. Database Order

#### Tabel `orders`

| Column     | Data Type | Not Null | Auto Increment | Key     | Default           |
| ---------- | --------- | -------- | -------------- | ------- | ----------------- |
| id         | INT       | [✓]      | [✓]            | PRIMARY |                   |
| product_id | INT       |          |                |         |                   |
| user_id    | INT       |          |                |         |                   |
| quantity   | INT       |          |                |         |                   |
| created_at | TIMESTAMP |          |                |         | CURRENT_TIMESTAMP |

### 4. Database Notification

#### Tabel `notifications`

| Column     | Data Type    | Not Null | Auto Increment | Key     | Default           |
| ---------- | ------------ | -------- | -------------- | ------- | ----------------- |
| id         | INT          | [✓]      | [✓]            | PRIMARY |                   |
| message    | VARCHAR(200) |          |                |         |                   |
| created_at | TIMESTAMP    |          |                |         | CURRENT_TIMESTAMP |

## 💻 Cara Menjalankan

### Menggunakan Docker

1. Masukkan nilai variable untuk _environment_ pada file `docker-compose.yml`
2. Jalankan `docker-compose up -d`

aplikasi dapat dibuka pada:

- Users service: [http://localhost:8000/users](http://localhost:8000/users)
- Products service: [http://localhost:8000/products](http://localhost:8000/products).
- Orders service: [http://localhost:8000/orders](http://localhost:8000/orders).
- Notifications service: [http://localhost:8000/notifications](http://localhost:8000/notifications).

## 📄 Dokumentasi API

Link dokumentasi API: [https://documenter.getpostman.com/view/34751005/2sA3Qv7qNG](https://documenter.getpostman.com/view/34751005/2sA3Qv7qNG)

## 🚧 Fitur Mendatang

1. _Payment Service_
