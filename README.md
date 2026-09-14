# Лаборатори №2 — k6 гүйцэтгэлийн хэмжүүр

**Оюутны нэр:** Бат-Эрдэнэ Дөлгөөн
**Оюутны код:** B242270136

## Зорилго ба зөвшөөрөгдсөн бай

Энэ лабораторид k6 ашиглан latency (p90/p95), throughput болон error rate-ийг хэмжив. Бүх HTTP ачааллын тестийн бай нь зааварт зөвшөөрсөн дадлагын сайт `https://test.k6.io` байна. `script.js` нь 5 VU, 1 минутын baseline тестийн анхдагч тохиргоотой; CLI-ээр VU болон хугацааг тусад нь өөрчилж болно. `stages.js` нь ачааллыг 5 → 30 → 100 VU болгож өсгөөд буулгах тусдаа туршилт юм.

## Орчны мэдээлэл

```text
k6 v2.1.0 (commit/83a87a41e2, go1.26.4, linux/amd64)
```

Тестүүдийг `k6 run script.js` командаар ажиллуулна. Бүрэн summary-г үр дүнгийн файлд хадгалсан.

## Хэмжилтийн үр дүн

| VU | Үргэлжлэх хугацаа | p90 (ms) | p95 (ms) | Throughput (http_reqs/s) | Error rate (http_req_failed) | Эх файл |
|---:|---:|---:|---:|---:|---:|---|
| 5 | 1m | 261.48 | 291.09 | 7.397709 | 0.00% | [run-05vu.txt](results/run-05vu.txt) |
| 30 | 1m | 250.04 | 258.75 | 45.233031 | 0.00% | [run-30vu.txt](results/run-30vu.txt) |
| 100 | 1m | 267.05 | 292.04 | 147.274481 | 0.00% | [run-100vu.txt](results/run-100vu.txt) |

`http_reqs`-ийн секундын дундаж утгыг throughput гэж авч, `http_req_failed`-ийн `rate`-ийг алдааны хувь гэж уншина. Хүснэгтийн утгыг дээрх гурван тусдаа `run-*.txt` summary-гаас авсан.

## SLO ба threshold

5 VU baseline-ийн p95 = **291.09 ms**. Үүнд тулгуурлан latency SLO-г `p(95) < baseline × 1.5 = 436.64 ms` гэж тогтоов: baseline-аас 50% хүртэлх өсөлтийг хэлбэлзэлд зөвшөөрөх боловч түүнээс цааш муудвал чанарын gate-д FAIL өгөх зорилготой. Error rate SLO нь `< 1%`; хүсэлтүүдийн 1%-иас олноор бүтэлгүйтвэл хэрэглэгчид мэдэгдэхүйц алдаа үзүүлнэ.

| Тест | Latency threshold | Error threshold | Үр дүн |
|---|---:|---:|---|
| SLO PASS | p(95) < 436.64 ms | rate < 0.01 | PASS; run-д 434.49 ms-ийн арай хатуу босго хэрэглэж, p95 = 305.11 ms гарсан |
| Санаатай хатуу FAIL | p(95) < 50 ms | rate < 0.01 | FAIL; p95 = 298.50 ms, error rate = 0.00% |

Threshold-тэй хоёр тусдаа скриптийн бүтэн гаралт `results/threshold-pass.txt`, `results/threshold-fail.txt` файлд байна. FAIL тест нь санаатайгаар хатуу босготой, зөвхөн чанарын gate хэрхэн ажилладгийг харуулах зориулалттай.

Stages туршилт 5 → 30 → 100 → 0 VU өсөж буурсан нэгтгэсэн summary өгсөн. Тэр summary-ийн p95 нь 227.60 ms, throughput нь 46.71 хүсэлт/сек, error rate нь 0.00% (0/7026 хүсэлт) байсан; үе шат бүрийг салгаж тайлагнахгүй тул энэ утгыг гурван түвшний хүснэгтэд ашиглаагүй.

## Дүгнэлт

_Дүгнэлт (9 өгүүлбэр):_

1. Энэ лабораторид k6 v2.1.0 ашиглан зөвшөөрөгдсөн `test.k6.io` дадлагын сайтыг хэмжив.
2. 5 VU үед p95 latency 291.09 ms, throughput 7.40 хүсэлт/сек байв.
3. 30 VU үед p95 latency 258.75 ms болж, 5 VU baseline-аас буурсан.
4. 100 VU үед p95 latency 292.04 ms, throughput 147.27 хүсэлт/сек болсон.
5. Ачаалал нэмэгдэхэд throughput 7.40-өөс 147.27 хүсэлт/сек хүртэл өссөн бөгөөд p95 latency baseline-тэй ойролцоо байв.
6. Эдгээр хэмжилтээр 100 VU хүртэл нэг хэрэглэгчийн туршлага мэдэгдэхүйц муудах цэг ажиглагдсангүй.
7. Гурван тусдаа туршилт болон stages туршилтад error rate 0% байж, status 200 шалгалтууд амжилттай өнгөрөв.
8. Baseline p95-ийн 1.5 дахин босго буюу 436.64 ms latency SLO-г тогтоосон; арай хатуу 434.49 ms босготой 30 секундийн шалгалт p95=305.11 ms гарган PASS болсон.
9. 50 ms хатуу босготой тест 298.50 ms p95 хэмжээд FAIL болж, threshold чанарын gate болж ажилладгийг харуулав.

## Үр дүнгийн файлууд

- [5 VU бүрэн k6 гаралт](results/run-05vu.txt)
- [30 VU бүрэн k6 гаралт](results/run-30vu.txt)
- [100 VU бүрэн k6 гаралт](results/run-100vu.txt)
- [Stages өсгөх/буулгах туршилтын бүрэн гаралт](results/run-stages.txt)
- [SLO PASS гаралт](results/threshold-pass.txt) болон [хатуу SLO FAIL гаралт](results/threshold-fail.txt)
- Summary screenshot-ууд: [5 VU](results/vue5-2.png), [30 VU](results/vue30-2.png), [100 VU](results/vue100-2.png), [stages](results/runstage-2.png), [SLO PASS](results/thresholdpass-2.png), [SLO FAIL](results/thresholdfail-2.png)

## Ажиллуулах командууд

```bash
mkdir -p results
k6 version
k6 run --vus 5 --duration 1m script.js | tee results/run-05vu.txt
k6 run --vus 30 --duration 1m script.js | tee results/run-30vu.txt
k6 run --vus 100 --duration 1m script.js | tee results/run-100vu.txt
k6 run stages.js | tee results/run-stages.txt
k6 run threshold-pass.js | tee results/threshold-pass.txt
k6 run threshold-fail.js | tee results/threshold-fail.txt
```
