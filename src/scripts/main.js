import { topicIconColor, topicShowMore } from '@/scripts/components/topic.js'
import { initSwipers } from '@/scripts/components/swiper.js'
import { accordionsInit } from '@/scripts/components/accordion.js'
import { filtersHandler } from '@/scripts/components/filters.js'
import { calendarInit } from '@/scripts/components/calendar.js'
import { initModalSystem, registerModal } from '@/scripts/components/modal.js'
import { truncateAccordionText } from '@/scripts/utils/truncText.js'
import { initCopyTo } from '@/scripts/components/copy-to.js'

import '@/scripts/components/table.js'
import '@/scripts/components/playVideo.js'
import '@/scripts/components/stars.js'
import '@/scripts/components/tag.js'
import '@/scripts/components/ad-banner.js'
import '@/scripts/components/emoji.js'

import 'swiper/css'
import 'air-datepicker/air-datepicker.css'
import '@/styles/styles.scss'

function getPageIdFromUrl() {
  const path = window.location.pathname.replace(/\/+/g, '/').replace(/^\/|\/$/g, '') // убираем ведущий/замыкающий слеш
  if (!path || path === '') return 'index'
  // /about -> about, /about/index.html -> about/index
  return path.replace(/\.html$/i, '') // about или about/index
}

const pageModules = import.meta.glob('./pages/**/*.js') // создаст ленивые загрузчики

async function boot() {
  const pageId = getPageIdFromUrl()
  // Пытаемся найти модуль страницы по двум конвенциям:
  // 1) ./pages/${pageId}.js (например, pages/media.js)
  // 2) ./pages/${lastSegment}/index.js (например, pages/media/index.js)
  const last = pageId.split('/').pop()
  const candidates = [`./pages/${pageId}.js`, `./pages/${last}/index.js`]

  for (const key of candidates) {
    const loader = pageModules[key]
    if (loader) {
      const mod = await loader()
      // вызываем init() или default(), если есть
      if (typeof mod.init === 'function') await mod.init()
      else if (typeof mod.default === 'function') await mod.default()
      break
    }
  }
}

boot()

const initScripts = () => {
  // Topic Scripts
  topicIconColor()
  topicShowMore()
  // Swiper Scripts
  initSwipers()
  // Accordions Init
  accordionsInit()
  // Filters
  filtersHandler()
  // Calendar
  calendarInit()
  // Modal
  initModalSystem()
  // Copy
  const cleanupCopyTo = initCopyTo({
    // можно настроить селекторы/тексты:
    // successText: 'Скопировано!',
    // failText: 'Ошибка копирования',
  })
}

document.addEventListener('DOMContentLoaded', (e) => {
  initScripts()

  truncateAccordionText('.ad_accordion_text', 150, {
    showText: 'Показать все...',
    hideText: 'Скрыть',
    btnClass: 'ad_accordion_text_show-more',
  })

  truncateAccordionText('.influencer_card_description', 70, {
    showText: 'Показать все...',
    hideText: 'Скрыть',
    btnClass: 'influencer_card_description_more',
  })

  truncateAccordionText('.table_subTitle', 140, {
    showText: 'Показать все...',
    hideText: 'Скрыть',
    btnClass: 'influencer_card_description_more',
  })

  truncateAccordionText('.post_alt_text', 190, {
    showText: 'Показать еще...',
    hideText: 'Скрыть',
    btnClass: 'post_alt_text_more',
  })

  // Регистрируем модалки
  const burger = document.querySelector('.burger')
  registerModal('mobile-menu', {
    closeOnBackdrop: true,
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => burger.classList.add('active'),
    onClose: (modal) => burger.classList.remove('active'),
  })
  registerModal('mobile-topic', {
    closeOnBackdrop: true,
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Меню открыто'),
    onClose: (modal) => console.log('Меню закрыто'),
  })
  registerModal('banner-sizes', {
    closeOnBackdrop: true,
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Меню открыто'),
    onClose: (modal) => console.log('Меню закрыто'),
  })
  registerModal('search-results', {
    closeOnBackdrop: false, // Не закрывать при клике на бэкдроп
    closeOnEscape: true,
    exclusive: false,
    onOpen: (modal) => {
      const input = modal.querySelector('input')
      // if (input) input.focus()
    },
  })
  registerModal('form-sended', {
    closeOnBackdrop: false, // Не закрывать при клике на бэкдроп
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Modal открыто'),
  })
  registerModal('form-representative', {
    closeOnBackdrop: false, // Не закрывать при клике на бэкдроп
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Modal открыто'),
  })
  registerModal('form-mistake', {
    closeOnBackdrop: false, // Не закрывать при клике на бэкдроп
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Modal открыто'),
  })
  registerModal('form-command', {
    closeOnBackdrop: false, // Не закрывать при клике на бэкдроп
    closeOnEscape: true,
    exclusive: true,
    onOpen: (modal) => console.log('Modal открыто'),
  })

  // Кнопки показа промокода
  const btns = document.querySelectorAll('[data-promo]')
  if (btns?.length > 0) {
    btns.forEach((btn) => {
      const copyEl = btn.nextElementSibling
      btn.addEventListener('click', (e) => {
        btn.style = 'display: none;'
        copyEl.classList.remove('single_page_copy--hidden')
        console.log(copyEl)
      })
    })
  }

  /* Smooth Scroll by Anchor links */
  // Добавляем обработчик для каждой ссылки
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  const offsetTop = 80
  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault() // Предотвращаем стандартное поведение

      // Получаем ID целевого артикла из href ссылки
      const targetId = this.getAttribute('href')
      const targetArticle = document.querySelector(targetId)

      if (targetArticle) {
        // Вычисляем позицию, куда нужно прокрутить
        const targetPosition = targetArticle.offsetTop - offsetTop

        // Плавная прокрутка
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        })

        // Добавляем/удаляем класс активной ссылки
        // navLinks.forEach((link) => link.classList.remove('active'))
        // this.classList.add('active')
      }
    })
  })
})
