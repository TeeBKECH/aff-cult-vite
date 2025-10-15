import { initWikiLangSwitcher } from '@/scripts/components/wiki.js'
const root = document.querySelector('[data-widget="wiki"]')
// Включить чтение языка из URL (?lang=ru/en) — просто раскомментируйте:
const api = initWikiLangSwitcher(root, {
  defaultLang: 'en',
  // useQueryParam: true, // читать из ?lang
  // queryParam: 'lang', // имя параметра
  // writeQueryParam: true, // записывать выбор обратно в URL
  // writeQueryMode: 'replace', // или 'push' для истории
})
// Пример программного переключения:
// api.setLang('ru');
