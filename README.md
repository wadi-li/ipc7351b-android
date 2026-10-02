# IPC-7351B — справочник посадочных мест чип-компонентов

Расчёт посадочных мест резисторов, конденсаторов MLCC и чип-дросселей по IPC-7351B для Level A, B и C. Коррекция «без свешивания», экспорт в CSV / JSON / KiCad `.kicad_mod` / Markdown, тёмная тема, встроенная инструкция. Работает офлайн.

## Скачать APK

**[IPC7351B.apk — последняя сборка](https://github.com/wadi-li/ipc7351b-android/releases/latest/download/IPC7351B.apk)**

Android 7.0+. Откройте файл на телефоне и разрешите установку из неизвестных источников. APK собирается GitHub Actions (workflow `Build APK`) при каждом изменении в `main` и публикуется в [Releases](https://github.com/wadi-li/ipc7351b-android/releases).

> Debug-сборка подписывается временным ключом сборщика, поэтому перед установкой новой версии удалите предыдущую.

## Веб-версия (PWA)

После включения GitHub Pages (Settings → Pages → Source: **GitHub Actions**) приложение доступно по адресу https://wadi-li.github.io/ipc7351b-android/ — в Chrome на Android: ⋮ → «Установить приложение».

## Структура

| Путь | Назначение |
|---|---|
| `docs/index.html` | разметка и стили |
| `docs/app.js` | библиотека корпусов (`LIB`), коэффициенты (`J`), расчёт, экспорт |
| `docs/help.js` | инструкция в Markdown |
| `app/` | Android-обёртка WebView; ресурсы берутся из `docs/` |
| `.github/workflows/build-apk.yml` | сборка APK и публикация релиза |
| `.github/workflows/pages.yml` | публикация PWA |

## Обновление

Правка библиотеки и коэффициентов — в `docs/app.js`. Для Android увеличьте `versionCode`/`versionName` в `app/build.gradle`, для PWA — версию кэша в `docs/sw.js`.
