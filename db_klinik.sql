--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2026-02-07 12:52:56

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 52922)
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    user_id integer,
    no_hp character varying(20),
    alamat text,
    tanggal_lahir date,
    status_pendidikan character varying(100),
    status_pekerjaan character varying(100),
    status_pernikahan character varying(100),
    jumlah_anak integer DEFAULT 0,
    riwayat_keguguran character varying(255),
    memiliki_komplikasi_kehamilan boolean DEFAULT false,
    jenis_komplikasi_kehamilan character varying(255),
    memiliki_komplikasi_persalinan boolean DEFAULT false,
    jenis_komplikasi_persalinan character varying(255),
    riwayat_gangguan_kejiwaan character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.profiles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 52921)
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profiles_id_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 219
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- TOC entry 222 (class 1259 OID 52940)
-- Name: riwayat_persalinan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.riwayat_persalinan (
    id integer NOT NULL,
    user_id integer,
    tahun_lahir character varying(4),
    kondisi_ketika_lahir text,
    cara_persalinan character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.riwayat_persalinan OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 52939)
-- Name: riwayat_persalinan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.riwayat_persalinan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.riwayat_persalinan_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 221
-- Name: riwayat_persalinan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.riwayat_persalinan_id_seq OWNED BY public.riwayat_persalinan.id;


--
-- TOC entry 224 (class 1259 OID 52970)
-- Name: screenings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.screenings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_score integer NOT NULL,
    kategori character varying(100) NOT NULL,
    jawaban_json jsonb,
    flag_bunuh_diri boolean DEFAULT false,
    waktu_skrining timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    profile_snapshot jsonb,
    deleted_at timestamp without time zone,
    catatan_nakes text,
    status_penanganan character varying(50) DEFAULT 'Belum Ditangani'::character varying
);


ALTER TABLE public.screenings OWNER TO postgres;

--
-- TOC entry 4946 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN screenings.deleted_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.screenings.deleted_at IS 'Timestamp when the screening was soft deleted. NULL means not deleted.';


--
-- TOC entry 223 (class 1259 OID 52969)
-- Name: screenings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.screenings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.screenings_id_seq OWNER TO postgres;

--
-- TOC entry 4947 (class 0 OID 0)
-- Dependencies: 223
-- Name: screenings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.screenings_id_seq OWNED BY public.screenings.id;


--
-- TOC entry 218 (class 1259 OID 52909)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nama_lengkap character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['pasien'::character varying, 'tenagakesehatan'::character varying, 'superadmin'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 52908)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4948 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4759 (class 2604 OID 52925)
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 52943)
-- Name: riwayat_persalinan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_persalinan ALTER COLUMN id SET DEFAULT nextval('public.riwayat_persalinan_id_seq'::regclass);


--
-- TOC entry 4766 (class 2604 OID 52973)
-- Name: screenings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.screenings ALTER COLUMN id SET DEFAULT nextval('public.screenings_id_seq'::regclass);


--
-- TOC entry 4757 (class 2604 OID 52912)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4934 (class 0 OID 52922)
-- Dependencies: 220
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profiles (id, user_id, no_hp, alamat, tanggal_lahir, status_pendidikan, status_pekerjaan, status_pernikahan, jumlah_anak, riwayat_keguguran, memiliki_komplikasi_kehamilan, jenis_komplikasi_kehamilan, memiliki_komplikasi_persalinan, jenis_komplikasi_persalinan, riwayat_gangguan_kejiwaan, created_at) FROM stdin;
3	4	0833333333333	Bogor	2001-01-01	Perguruan Tinggi (D3 / S1 / S2)	Tidak Bekerja	Menikah	1	Pernah	t	Hipertensi / Preeklamsia	t	Perdarahan Pasca Salin	Pernah	2026-01-12 18:51:13.863469
4	5	08123456781	Jl. Mawar No. 1	\N	\N	\N	\N	1	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
5	6	08123456782	Jl. Melati No. 2	\N	\N	\N	\N	1	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
6	7	08123456783	Jl. Anggrek No. 3	\N	\N	\N	\N	2	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
7	8	08123456784	Jl. Kenanga No. 4	\N	\N	\N	\N	3	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
8	9	08123456785	Jl. Cempaka No. 5	\N	\N	\N	\N	1	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
9	10	08123456786	Jl. Dahlia No. 6	\N	\N	\N	\N	2	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
10	11	08123456787	Jl. Tulip No. 7	\N	\N	\N	\N	4	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
11	12	08123456788	Jl. Sakura No. 8	\N	\N	\N	\N	1	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
12	13	08123456789	Jl. Teratai No. 9	\N	\N	\N	\N	2	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
13	14	08123456700	Jl. Kamboja No. 10	\N	\N	\N	\N	1	\N	f	\N	f	\N	\N	2026-02-04 00:04:58.749627
14	16	081289793197	Kp. babakan Bandung Rt 007/RW 001	2004-10-04	Perguruan Tinggi (D3 / S1 / S2)	Bekerja	Menikah	1	Tidak Pernah	f	Tidak Ada	f	Tidak Ada	Pernah	2026-02-07 12:46:51.836542
\.


--
-- TOC entry 4936 (class 0 OID 52940)
-- Dependencies: 222
-- Data for Name: riwayat_persalinan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.riwayat_persalinan (id, user_id, tahun_lahir, kondisi_ketika_lahir, cara_persalinan, created_at) FROM stdin;
\.


--
-- TOC entry 4938 (class 0 OID 52970)
-- Dependencies: 224
-- Data for Name: screenings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.screenings (id, user_id, total_score, kategori, jawaban_json, flag_bunuh_diri, waktu_skrining, profile_snapshot, deleted_at, catatan_nakes, status_penanganan) FROM stdin;
3	4	11	Perlu Skrining Ulang	{"0": 1, "1": 2, "2": 1, "3": 2, "4": 1, "5": 1, "6": 2, "7": 1, "8": 0, "9": 0}	f	2026-01-12 22:23:09.058527	\N	\N	\N	Belum Ditangani
4	4	8	Tidak Ada Gejala Depresi	{"0": 0, "1": 2, "2": 1, "3": 1, "4": 3, "5": 0, "6": 1, "7": 0, "8": 0, "9": 0}	f	2026-01-12 22:39:35.206219	\N	\N	\N	Belum Ditangani
5	4	11	Perlu Skrining Ulang	{"0": 0, "1": 2, "2": 0, "3": 3, "4": 0, "5": 0, "6": 1, "7": 2, "8": 3, "9": 0}	f	2026-01-12 22:39:53.010411	\N	\N	\N	Belum Ditangani
6	4	8	Tidak Ada Gejala Depresi	{"0": 1, "1": 2, "2": 0, "3": 3, "4": 1, "5": 1, "6": 0, "7": 0, "8": 0, "9": 0}	f	2026-01-12 22:40:08.89884	\N	\N	\N	Belum Ditangani
7	4	8	Tidak Ada Gejala Depresi	{"0": 0, "1": 3, "2": 0, "3": 3, "4": 1, "5": 0, "6": 0, "7": 0, "8": 1, "9": 0}	f	2026-01-12 22:59:33.326779	\N	\N	\N	Belum Ditangani
8	4	6	Tidak Ada Gejala Depresi	{"0": 0, "1": 2, "2": 0, "3": 3, "4": 1, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0}	f	2026-01-12 23:33:43.565367	{"id": 4, "role": "pasien", "email": "salsabilaoktaviani@gmail.com", "no_hp": "0833333333333", "alamat": "Bogor", "pekerjaan": "Bekerja", "pendidikan": "Tidak Sekolah", "jumlah_anak": 1, "nama_lengkap": "Salsabila Oktaviani", "tanggal_lahir": "2001-01-01T17:00:00.000Z", "profile_completed": true, "riwayat_keguguran": "Pernah", "status_pernikahan": "Menikah", "komplikasi_hamil_ini": "Hipertensi / Preeklamsia", "riwayat_kesehatan_jiwa": "Pernah", "komplikasi_persalinan_lalu": "Perdarahan Pasca Salin"}	\N	\N	Belum Ditangani
9	4	9	Perlu Skrining Ulang	{"0": 0, "1": 2, "2": 0, "3": 3, "4": 1, "5": 2, "6": 1, "7": 0, "8": 0, "9": 0}	f	2026-01-12 23:42:39.226591	{"id": 4, "role": "pasien", "email": "salsabilaoktaviani@gmail.com", "no_hp": "0833333333333", "alamat": "Bogor", "pekerjaan": "Tidak Bekerja", "pendidikan": "Perguruan Tinggi (D3 / S1 / S2)", "jumlah_anak": 1, "nama_lengkap": "Salsabila Oktaviani", "tanggal_lahir": "2000-12-31T17:00:00.000Z", "profile_completed": true, "riwayat_keguguran": "Pernah", "status_pernikahan": "Menikah", "komplikasi_hamil_ini": "Hipertensi / Preeklamsia", "riwayat_kesehatan_jiwa": "Pernah", "komplikasi_persalinan_lalu": "Perdarahan Pasca Salin"}	\N	\N	Belum Ditangani
10	5	4	Aman	[0, 0, 0, 1, 0, 1, 1, 1, 0, 0]	f	2026-02-03 00:04:58.749627	\N	\N	\N	Selesai
11	6	11	Perlu Skrining Ulang	[1, 1, 1, 1, 1, 2, 2, 1, 1, 0]	f	2026-02-02 00:04:58.749627	\N	\N	\N	Belum Ditangani
12	7	16	Kemungkinan Depresi	[2, 2, 2, 2, 1, 2, 2, 1, 2, 0]	f	2026-02-01 00:04:58.749627	\N	\N	\N	Sudah Dihubungi
13	8	14	Kemungkinan Depresi	[1, 1, 2, 1, 2, 2, 1, 2, 1, 1]	t	2026-02-03 12:04:58.749627	\N	\N	\N	Belum Ditangani
14	9	2	Aman	[0, 0, 0, 0, 0, 0, 0, 1, 0, 1]	f	2026-01-30 00:04:58.749627	\N	\N	\N	Selesai
15	10	12	Perlu Skrining Ulang	[2, 1, 1, 1, 1, 1, 2, 1, 1, 1]	f	2026-01-31 00:04:58.749627	\N	\N	\N	Sudah Dihubungi
16	11	5	Aman	[0, 1, 0, 0, 1, 1, 1, 1, 0, 0]	f	2026-01-29 00:04:58.749627	\N	\N	\N	Selesai
17	13	8	Aman	[1, 1, 1, 1, 1, 1, 1, 1, 0, 0]	f	2026-01-29 00:04:58.749627	\N	\N	\N	Selesai
18	14	20	Kemungkinan Depresi	[3, 3, 2, 2, 2, 2, 2, 2, 2, 0]	f	2026-01-28 00:04:58.749627	\N	\N	\N	Sudah Dihubungi
19	5	3	Aman	[0, 0, 0, 0, 0, 0, 0, 0, 0, 3]	f	2026-01-27 00:04:58.749627	\N	\N	\N	Selesai
20	6	15	Kemungkinan Depresi	[2, 2, 2, 2, 2, 2, 1, 0, 2, 0]	f	2026-01-25 00:04:58.749627	\N	\N	\N	Belum Ditangani
21	7	6	Aman	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]	f	2026-01-20 00:04:58.749627	\N	\N	\N	Selesai
22	16	11	Perlu Skrining Ulang	{"0": 1, "1": 0, "2": 1, "3": 2, "4": 1, "5": 1, "6": 2, "7": 1, "8": 1, "9": 1}	t	2026-02-07 12:48:39.520858	{"id": 16, "role": "pasien", "email": "slsabilaokt2112@gmail.com", "no_hp": "081289793197", "alamat": "Kp. babakan Bandung Rt 007/RW 001", "pekerjaan": "Bekerja", "pendidikan": "Perguruan Tinggi (D3 / S1 / S2)", "jumlah_anak": 1, "nama_lengkap": "Salsabila Oktaviani", "tanggal_lahir": "2004-10-03T17:00:00.000Z", "profile_completed": true, "riwayat_keguguran": "Tidak Pernah", "status_pernikahan": "Menikah", "komplikasi_hamil_ini": "Tidak Ada", "riwayat_kesehatan_jiwa": "Pernah", "komplikasi_persalinan_lalu": "Tidak Ada"}	\N	\N	Belum Ditangani
\.


--
-- TOC entry 4932 (class 0 OID 52909)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nama_lengkap, email, password, role, created_at) FROM stdin;
4	Salsabila Oktaviani	salsabilaoktaviani@gmail.com	$2b$10$RgNs35i7x1wWmHdsXUYbM.tcfJftwgpUBQ3BgAQF2/Z3//7UEblQK	pasien	2025-12-30 00:28:11.945258
1	Superadmin	superadmin@gmail.com	$2b$10$fq6sdS3UEGr8tgqEGNeYsOIUB2kibD/lKH5K6dAYftIwcMR4tKXja	superadmin	2025-12-30 00:05:15.559861
5	Ibu Citra Lestari	citra@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
6	Ibu Dewi Sartika	dewi@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
7	Ibu Eka Pratiwi	eka@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
8	Ibu Fitri Handayani	fitri@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
9	Ibu Gita Gutawa	gita@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
10	Ibu Hana Pertiwi	hana@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
11	Ibu Indah Permata	indah@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
12	Ibu Joko (Istri)	joko@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
13	Ibu Kartika Putri	kartika@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
14	Ibu Larasati	laras@test.com	$2b$10$abcdefg...	pasien	2026-02-04 00:04:58.749627
15	Salsabila Oktaviani	fathi.ramdhana@gmail.com	$2b$10$PIZADozpfXsmfo/CLaOPQuenyln9EX1VWjkOn7FHcMejDOjjbW5PS	pasien	2026-02-07 12:29:09.386429
16	Salsabila Oktaviani	slsabilaokt2112@gmail.com	$2b$10$Qiq/ePq.TpGIXpkzNx37vO/v/QM8DQwNk1bYbVtYk7H85hB4g4IZe	pasien	2026-02-07 12:29:41.450507
3	Muhammad Fathi Ramdhana	fathiramdhana@gmail.com	$2b$10$fq6sdS3UEGr8tgqEGNeYsOIUB2kibD/lKH5K6dAYftIwcMR4tKXja	tenagakesehatan	2025-12-30 00:16:00.628233
\.


--
-- TOC entry 4949 (class 0 OID 0)
-- Dependencies: 219
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profiles_id_seq', 14, true);


--
-- TOC entry 4950 (class 0 OID 0)
-- Dependencies: 221
-- Name: riwayat_persalinan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.riwayat_persalinan_id_seq', 1, false);


--
-- TOC entry 4951 (class 0 OID 0)
-- Dependencies: 223
-- Name: screenings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.screenings_id_seq', 22, true);


--
-- TOC entry 4952 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- TOC entry 4776 (class 2606 OID 52933)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 4778 (class 2606 OID 52948)
-- Name: riwayat_persalinan riwayat_persalinan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_persalinan
    ADD CONSTRAINT riwayat_persalinan_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 52979)
-- Name: screenings screenings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.screenings
    ADD CONSTRAINT screenings_pkey PRIMARY KEY (id);


--
-- TOC entry 4772 (class 2606 OID 52920)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4774 (class 2606 OID 52918)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 1259 OID 52986)
-- Name: idx_screenings_deleted_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_screenings_deleted_at ON public.screenings USING btree (deleted_at);


--
-- TOC entry 4780 (class 1259 OID 52988)
-- Name: idx_screenings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_screenings_status ON public.screenings USING btree (status_penanganan);


--
-- TOC entry 4783 (class 2606 OID 52934)
-- Name: profiles profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 52949)
-- Name: riwayat_persalinan riwayat_persalinan_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.riwayat_persalinan
    ADD CONSTRAINT riwayat_persalinan_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 52980)
-- Name: screenings screenings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.screenings
    ADD CONSTRAINT screenings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-02-07 12:52:56

--
-- PostgreSQL database dump complete
--

