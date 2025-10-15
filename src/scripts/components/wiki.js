// wikiLangSwitcher.js
/**
 * Переключение русской/английской версий контента в рамках одного блока.
 * Скрывает/показывает любые элементы с data-lang="ru|en", КРОМЕ тех, что внутри .wiki_switcher.
 * H1 модуль не меняет — просто не задавайте ему data-lang.
 *
 * Порядок определения языка:
 *   (если useQueryParam) ?lang -> localStorage -> активный пункт (.wiki_switcher_item-current) -> defaultLang
 *
 * Опции:
 * - defaultLang: 'en' | 'ru' (по умолчанию 'en')
 * - storageKey: ключ в localStorage (по умолчанию 'wikiLang')
 * - useQueryParam: читать язык из GET-параметра (false по умолчанию)
 * - queryParam: имя GET-параметра (по умолчанию 'lang')
 * - writeQueryParam: записывать выбранный язык в URL (false по умолчанию)
 * - writeQueryMode: 'replace' | 'push' (как обновлять URL; по умолчанию 'replace')
 * - allowed: массив разрешенных языков; по умолчанию — берется из свитчера
 * - onChange(lang): колбэк при смене языка
 *
 * Возвращает API: { getLang, setLang, destroy }
 */
export function initWikiLangSwitcher(root = document, opts = {}) {
  const {
    defaultLang = 'en',
    storageKey = 'wikiLang',
    useQueryParam = false,
    queryParam = 'lang',
    writeQueryParam = false,
    writeQueryMode = 'replace', // 'replace' | 'push'
    allowed,
    onChange,
  } = opts

  const switcher = root.querySelector('.wiki_switcher')
  if (!switcher) return

  const items = Array.from(switcher.querySelectorAll('.wiki_switcher_item'))
  if (!items.length) return

  // Проставим data-lang для пунктов свитчера, если не задано
  items.forEach((el) => {
    const lang = (el.dataset.lang || guessLang(el.textContent)).toLowerCase()
    el.dataset.lang = lang
    el.setAttribute('role', 'tab')
    if (!el.getAttribute('href')) el.setAttribute('href', '#')
  })

  // Разрешенные языки — либо из опции, либо из свитчера
  const allowedList =
    Array.isArray(allowed) && allowed.length
      ? allowed.map((s) => String(s).toLowerCase())
      : Array.from(new Set(items.map((i) => i.dataset.lang.toLowerCase())))

  const allowedSet = new Set(allowedList)

  let current = pickInitialLang()

  applyLang(current, { silent: true })

  // Слушаем клики по свитчеру
  const onClick = (e) => {
    const link = e.target.closest('.wiki_switcher_item[data-lang]')
    if (!link || !switcher.contains(link)) return
    e.preventDefault()
    applyLang(link.dataset.lang.toLowerCase())
  }
  switcher.addEventListener('click', onClick)

  function pickInitialLang() {
    // 1) GET-параметр (опционально)
    if (useQueryParam && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const q = (url.searchParams.get(queryParam) || '').toLowerCase()
      if (allowedSet.has(q)) return q
    }
    // 2) localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = (localStorage.getItem(storageKey) || '').toLowerCase()
      if (allowedSet.has(stored)) return stored
    }
    // 3) Активный пункт свитчера
    const active = items
      .find((el) => el.classList.contains('wiki_switcher_item-current'))
      ?.dataset.lang?.toLowerCase()
    if (active && allowedSet.has(active)) return active

    // 4) default
    return allowedSet.has(defaultLang.toLowerCase()) ? defaultLang.toLowerCase() : allowedList[0]
  }

  function applyLang(lang, { silent = false } = {}) {
    if (!allowedSet.has(lang)) lang = defaultLang.toLowerCase()
    current = lang

    // Обновляем свитчер (НЕ скрываем его элементы)
    items.forEach((el) => {
      const isActive = el.dataset.lang.toLowerCase() === lang
      el.classList.toggle('wiki_switcher_item-current', isActive)
      el.setAttribute('aria-selected', String(isActive))
    })

    // Скрываем/показываем все data-lang, кроме тех, что внутри .wiki_switcher
    const langBlocks = Array.from(root.querySelectorAll('[data-lang]')).filter(
      (node) => !node.closest('.wiki_switcher'),
    )

    langBlocks.forEach((node) => {
      const shouldShow = node.dataset.lang.toLowerCase() === lang
      node.hidden = !shouldShow
      node.setAttribute('aria-hidden', String(!shouldShow))
    })

    // Сохраняем выбор
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, lang)
    }

    // Опционально обновляем URL
    if (!silent && writeQueryParam && typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href)
      url.searchParams.set(queryParam, lang)
      if (writeQueryMode === 'push' && window.history.pushState) {
        window.history.pushState({}, '', url)
      } else if (window.history.replaceState) {
        window.history.replaceState({}, '', url)
      }
    }

    if (typeof onChange === 'function') onChange(lang)
  }

  function getLang() {
    return current
  }
  function setLang(lang) {
    applyLang(String(lang).toLowerCase())
  }
  function destroy() {
    switcher.removeEventListener('click', onClick)
  }

  return { getLang, setLang, destroy }
}

function guessLang(text = '') {
  const t = text.trim().toLowerCase()
  if (t.startsWith('рус')) return 'ru'
  if (t.startsWith('en') || t.startsWith('angl') || t.startsWith('eng') || t.startsWith('english'))
    return 'en'
  return 'en'
}
