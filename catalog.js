document.addEventListener('DOMContentLoaded', function(){
  const categoriesGrid = document.querySelector('.categories-grid');
  const categoryContent = document.querySelector('#category-content');
  const sections = document.querySelectorAll('.category-section');
  const backBtn = document.querySelector('.back-btn');

  function fmtPrice(uah){ 
    return uah.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₴'; 
  }

  // Показ товарів категорії
  function showCategory(target) {
    categoriesGrid.style.display = 'none';
    categoryContent.style.display = 'block';
    sections.forEach(s => s.style.display = 'none');
    
    const section = document.querySelector(target);
    if(section) {
      section.style.display = 'block';
      section.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  // Повернення до категорій
  function showCategories() {
    categoryContent.style.display = 'none';
    categoriesGrid.style.display = 'grid';
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Масив завантажених товарів (буде заповнений після fetch)
  let loadedProducts = [];

  // Мапінг категорій (підтримуємо варіанти назв у JSON)
  const categories = {
    'Тактичне взуття': { selector: '#boots .products', active: true },
    'Берци': { selector: '#boots .products', active: true },
    'Рюкзаки': { selector: '#packs .products', active: true },
  'Військовий одяг': { selector: '#clothing .products', active: true },
    'Каски': { selector: '#helmets .products', active: false },
    'Плитоноски': { selector: '#plates .products', active: true },
    'Шеврони': { selector: '#patches .products', active: false }
  };

  // Функція рендеру товарів для секції (target наприклад '#boots')
  function renderProductsForSection(target) {
    const container = document.querySelector(target + ' .products');
    if(!container) return;

    // знайдемо всі категорії, які мапляться до цього селектора
    const allowedCats = Object.keys(categories).filter(k => categories[k].selector === (target + ' .products'));

    // фільтруємо товари
    const items = loadedProducts.filter(p => allowedCats.includes(p.category));

    container.innerHTML = '';
    if(items.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'Товари не знайдені.';
      empty.style.color = 'var(--muted)';
      container.appendChild(empty);
      return;
    }

    items.forEach(function(product){
      const card = document.createElement('article');
      card.className = 'product product-detailed';
      card.innerHTML = `
        <div class="product-media">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-body">
          <h4 class="product-title">${product.title}</h4>
          <p class="product-desc">${product.description}</p>
          <div class="product-actions">
            <p class="price">${fmtPrice(product.price_uah)}</p>
            <a class="btn buy" href="#" data-id="${product.id}">Купити</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Налаштовуємо кнопки категорій вже зараз — при кліку будемо показувати секцію і рендерити товари
  document.querySelectorAll('.show-category').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target; // наприклад '#boots'
      showCategory(target);

      // Якщо товари вже завантажені — рендеримо відразу, інакше робимо fetch
      if(loadedProducts.length > 0) {
        renderProductsForSection(target);
      } else {
        // коротке повідомлення про завантаження
        const container = document.querySelector(target + ' .products');
        if(container) {
          container.innerHTML = '<p style="color:var(--muted)">Завантаження товарів...</p>';
        }
        // повторна спроба завантажити товари
        fetch('data/products.json')
          .then(r => r.ok ? r.json() : Promise.reject('fetch failed'))
          .then(d => {
            loadedProducts = Array.isArray(d) ? d : (d.products || []);
            renderProductsForSection(target);
          })
          .catch(err => {
            console.error('Не вдалося підвантажити товари при кліку:', err);
            if(container) container.innerHTML = '<p style="color:var(--muted)">Не вдалося завантажити товари.</p>';
          });
      }
    });
  });

  // Завантаження та відображення товарів
  fetch('data/products.json')
    .then(function(resp){ 
      if(!resp.ok) throw new Error('Не вдалося завантажити products.json'); 
      return resp.json(); 
    })
    .then(function(data){
      const products = Array.isArray(data) ? data : (data.products || []);
      // зберігаємо завантажені товари для подальшого рендеру при кліку
      loadedProducts = products;

      // Очищаємо контейнери (виключно для унікальних селекторів)
      const cleared = new Set();
      Object.values(categories).forEach(function(cat){
        if(!cat || !cat.selector) return;
        if(cleared.has(cat.selector)) return;
        const container = document.querySelector(cat.selector);
        if(container) container.innerHTML = '';
        cleared.add(cat.selector);
      });

      // Після завантаження — якщо є берци, автоматично показуємо секцію "#boots"
      const bootsExist = loadedProducts.some(p => p.category === 'Берци' || p.category === 'Тактичне взуття');
      if(bootsExist) {
        // рендер і відкрити секцію
        renderProductsForSection('#boots');
        showCategory('#boots');
      }

      // Кнопка "Назад"
      if(backBtn) {
        backBtn.addEventListener('click', showCategories);
      }

      // Кнопки "Купити"
      document.addEventListener('click', function(e) {
        if(e.target.closest('.btn[data-id]')) {
          e.preventDefault();
          const productId = e.target.closest('.btn').dataset.id;
          alert('Товар ' + productId + ' доданий до кошика');
        }
      });
    })
    .catch(function(err){
      console.error('Помилка завантаження товарів:', err);
    });
});
