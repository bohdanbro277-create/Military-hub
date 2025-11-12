// Динамічне завантаження товарів для окремих сторінок категорій
document.addEventListener('DOMContentLoaded', function(){
  // Форматування ціни
  function fmtPrice(uah){ 
    return uah.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₴'; 
  }

  // Визначаємо поточну категорію по URL
  const currentPage = window.location.pathname.split('/').pop();
  const categoryMap = {
    'tactical-boots.html': 'Тактичне взуття',
    'backpacks.html': 'Рюкзаки',
    'military.html': 'Військовий одяг',
    'tourism.html': 'Туризм',
    'thermal.html': 'Термобілизна',
    'bags.html': 'Сумки',
    'accessories.html': 'Аксесуари',
    'equipment.html': 'Спорядження',
    'helmets.html': 'Каски',
    'plates.html': 'Плитоноски'
  };
  
  const currentCategory = categoryMap[currentPage];
  if (!currentCategory) return; // Якщо сторінка не відповідає категорії - виходимо

  // Знаходимо контейнер для товарів
  const productsContainer = document.querySelector('.products');
  if (!productsContainer) return;

  // Завантажуємо та відображаємо товари
  fetch('../data/products.json')
    .then(function(resp){ 
      if(!resp.ok) throw new Error('Не вдалося завантажити products.json'); 
      return resp.json(); 
    })
    .then(function(products){
      // Фільтруємо товари по поточній категорії
      const categoryProducts = products.filter(p => p.category === currentCategory);
      
      // Очищаємо контейнер
      productsContainer.innerHTML = '';
      
      // Відображаємо товари
      categoryProducts.forEach(function(p){
        const card = document.createElement('article');
        card.className = 'product';
        card.innerHTML = `
          <img src="${encodeURI(p.image)}" alt="${p.title}" style="width:100%;height:160px;object-fit:cover;border-radius:6px;margin-bottom:0.6rem">
          <h4>${p.title}</h4>
          <p style="color:var(--muted);font-size:0.95rem;margin:0.35rem 0">${p.description}</p>
          <p class="price">${fmtPrice(p.price_uah)}</p>
          <p><a class="btn" href="#" data-id="${p.id}"><span>Купити</span></a></p>
        `;
        productsContainer.appendChild(card);
      });
    })
    .catch(function(err){ 
      console.error(err);
      productsContainer.innerHTML = `
        <p style="color:var(--muted)">Помилка завантаження товарів: ${err.message}</p>
      `;
    });
});