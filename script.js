document.addEventListener('DOMContentLoaded', function () {
    // Dropdown toggle para telas pequenas
    var dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        var trigger = dropdown.querySelector('a');
        var content = dropdown.querySelector('.dropdown-content');

        trigger.addEventListener('click', function (e) {
            // só intercepta o clique para telas pequenas (menu empilhado)
            if (window.matchMedia('(max-width: 600px)').matches) {
                e.preventDefault();
                dropdown.classList.toggle('open');
                content.classList.toggle('show');
            }
        });

        // fecha dropdown ao clicar fora (mobile)
        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target) && dropdown.classList.contains('open')) {
                dropdown.classList.remove('open');
                content.classList.remove('show');
            }
        });

        // atualiza comportamento ao redimensionar (remove classes quando volta ao desktop)
        window.addEventListener('resize', function () {
            if (!window.matchMedia('(max-width: 600px)').matches) {
                dropdown.classList.remove('open');
                content.classList.remove('show');
            }
        });
    }

    // Carrossel simples
    var items = Array.from(document.querySelectorAll('.carousel-item'));
    var current = items.findIndex(i => i.classList.contains('active'));
    if (current === -1) current = 0;

    function showSlide(index) {
        items.forEach((it, idx) => {
            it.classList.toggle('active', idx === index);
        });
    }

    var prevBtn = document.querySelector('.carousel-control.prev');
    var nextBtn = document.querySelector('.carousel-control.next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            current = (current - 1 + items.length) % items.length;
            showSlide(current);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            current = (current + 1) % items.length;
            showSlide(current);
        });
    }

    // autoplay opcional (2,5s) — comentar se não quiser
    var autoplay = true;
    var intervalTime = 2500;
    var autoplayId = null;
    if (autoplay && items.length > 1) {
        autoplayId = setInterval(function () {
            current = (current + 1) % items.length;
            showSlide(current);
        }, intervalTime);

        // pausa autoplay ao focar ou passar o mouse no carrossel
        var carousel = document.querySelector('.carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', function () { clearInterval(autoplayId); });
            carousel.addEventListener('mouseleave', function () {
                autoplayId = setInterval(function () {
                    current = (current + 1) % items.length;
                    showSlide(current);
                }, intervalTime);
            });
        }
    }

    // Substituir/remapear receitas no HTML (remove Assado de Panela e Bife a Parmegiana)
    var recipeCards = Array.from(document.querySelectorAll('.recipe-card'));
    recipeCards.forEach(function (card) {
        var titleEl = card.querySelector('h3');
        var imgEl = card.querySelector('img');
        var pEl = card.querySelector('p');

        if (!titleEl) return;
        var title = titleEl.textContent.trim().toLowerCase();

        if (title.includes('assado')) {
            // substituir por Estrogonofre
            titleEl.textContent = 'Estrogonofre';
            if (imgEl) imgEl.src = 'https://via.placeholder.com/400x250/fff?text=Estrogonofre';
            if (imgEl) imgEl.alt = 'Estrogonofre';
            if (pEl) pEl.textContent = 'Clássico, cremoso e versátil — perfeito com arroz branco e batata palha.';
        } else if (title.includes('parmegiana') || title.includes('bife')) {
            // substituir por Frango à Parmegiana
            titleEl.textContent = 'Frango à Parmegiana';
            if (imgEl) imgEl.src = 'https://via.placeholder.com/400x250/fff?text=Frango+a+Parmegiana';
            if (imgEl) imgEl.alt = 'Frango à Parmegiana';
            if (pEl) pEl.textContent = 'Empanado crocante, molho de tomate caseiro e queijo gratinado — sucesso garantido.';
        }
    });

    // Criar modal de receitas (apenas uma instância)
    var modal = document.createElement('div');
    modal.className = 'recipe-modal';
    modal.innerHTML = '\
        <div class="modal-content" role="dialog" aria-modal="true">\
            <div class="modal-header">\
                <h3 id="recipeModalTitle"></h3>\
                <button class="close-modal" aria-label="Fechar">&times;</button>\
            </div>\
            <div class="modal-body" id="recipeModalBody"></div>\
        </div>';
    document.body.appendChild(modal);

    var modalTitle = modal.querySelector('#recipeModalTitle');
    var modalBody = modal.querySelector('#recipeModalBody');
    var closeBtn = modal.querySelector('.close-modal');

    function openModal(title, htmlContent) {
        modalTitle.textContent = title;
        modalBody.innerHTML = htmlContent;
        modal.classList.add('open');
        // foco para acessibilidade
        closeBtn.focus();
    }
    function closeModal() {
        modal.classList.remove('open');
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Conteúdos das receitas (pode personalizar)
    var recipes = {
        'frango cremoso com milho': {
            img: 'https://via.placeholder.com/800x450/fff?text=Frango+Cremoso+com+Milho',
            ingredients: [
                '500g de peito de frango em cubos',
                '1 lata de milho verde',
                '1 caixinha de creme de leite',
                '1 cebola picada',
                '2 dentes de alho',
                'sal e pimenta a gosto',
                'cheiro-verde para finalizar'
            ],
            steps: [
                'Refogue a cebola e o alho até dourar.',
                'Adicione o frango e sele até ficar cozido.',
                'Misture o milho e o creme de leite, ajuste o tempero.',
                'Finalize com cheiro-verde e sirva com arroz.'
            ]
        },
        'estrogonofre': {
            img: 'Receitas/Estrogonofre.png',
            ingredients: [
                '500g de carne (ou frango) em tiras',
                '1 cebola média picada',
                '200g de champignon fatiado',
                '2 colheres de sopa de ketchup',
                '1 colher de sopa de mostarda',
                '1 caixinha de creme de leite',
                'sal e pimenta a gosto'
            ],
            steps: [
                'Refogue a cebola até ficar translúcida.',
                'Adicione a carne/frango e doure bem.',
                'Junte o champignon, ketchup e mostarda, deixe incorporar.',
                'Por fim, acrescente o creme de leite, ajuste o sal e sirva.'
            ]
        },
        'fricasse de frango': {
            img: 'https://via.placeholder.com/800x450/fff?text=Fricass%C3%AA+de+Frango',
            ingredients: [
                '1 peito de frango cozido e desfiado',
                '1 lata de milho verde escorrido',
                '1 copo de requeijão cremoso',
                '1 caixinha de creme de leite',
                '100g de queijo muçarela ralado',
                'Batata palha a gosto para finalizar',
                'Sal e pimenta do reino a gosto'
            ],
            steps: [
                'Bata o milho, o requeijão e o creme de leite no liquidificador até formar um creme homogêneo.',
                'Em uma panela, misture o creme com o frango desfiado e tempere com sal e pimenta.',
                'Transfira para um refratário, cubra com queijo muçarela e leve ao forno pré-aquecido a 180°C até gratinar.',
                'Retire do forno, cubra com batata palha e sirva em seguida.'
            ]
        },
        'frango à parmegiana': {
            img: 'https://via.placeholder.com/800x450/fff?text=Frango+a+Parmegiana',
            ingredients: [
                '4 filés de frango',
                'Sal e pimenta a gosto',
                'Farinha de trigo e de rosca para empanar',
                '2 ovos batidos',
                '300g de molho de tomate',
                '200g de queijo muçarela',
                'Óleo para fritar'
            ],
            steps: [
                'Tempere os filés e empane passando na farinha de trigo, ovos e farinha de rosca.',
                'Frite os filés até dourarem e escorra em papel toalha.',
                'Em um refratário, coloque uma camada de molho, os filés e cubra com mais molho.',
                'Adicione o queijo muçarela por cima e leve ao forno pré-aquecido a 200°C até gratinar.',
                'Sirva em seguida.'
            ]
        }
    };

    // Abrir modal ao clicar em "Ver Receita"
    document.body.addEventListener('click', function (e) {
        if (e.target.matches('.btn-link')) {
            e.preventDefault();
            // encontra o card correspondente
            var card = e.target.closest('.recipe-card');
            if (!card) return;
            var title = (card.querySelector('h3') || {}).textContent || 'Receita';
            var key = title.trim().toLowerCase();

            var data = recipes[key] || null;
            if (!data) {
                // fallback simples: mostrar o conteúdo curto existente
                var img = card.querySelector('img') ? '<img src="' + card.querySelector('img').src + '" alt="">' : '';
                var desc = card.querySelector('p') ? '<p>' + card.querySelector('p').textContent + '</p>' : '';
                openModal(title, img + desc);
                return;
            }

            var html = '';
            if (data.img) html += '<img src="' + data.img + '" alt="' + title + '">';
            html += '<h4>Ingredientes</h4><ul>';
            data.ingredients.forEach(function (ing) { html += '<li>' + ing + '</li>'; });
            html += '</ul><h4>Modo de Preparo</h4><ol>';
            data.steps.forEach(function (s) { html += '<li>' + s + '</li>'; });
            html += '</ol>';
            openModal(title, html);
        }
    });

    // --- CÓDIGO PARA O MODAL DE PRODUTOS ---

    // 1. Dados nutricionais (substitua pelos dados reais dos seus produtos)
    const productsData = {
        'frango-inteiro': {
            name: 'Frango Inteiro',
            info: 'Nosso frango inteiro é selecionado e ideal para assados em família. Suculento e saboroso.',
            nutrition: {
                'Porção': '100g',
                'Valor Energético': '215 kcal',
                'Carboidratos': '0g',
                'Proteínas': '18g',
                'Gorduras Totais': '15g',
                'Sódio': '70mg'
            }
        },
        'peito': {
            name: 'Peito de Frango',
            info: 'Cortes de peito de frango versáteis, perfeitos para grelhados, filés e desfiados.',
            nutrition: {
                'Porção': '100g',
                'Valor Energético': '165 kcal',
                'Carboidratos': '0g',
                'Proteínas': '31g',
                'Gorduras Totais': '3.6g',
                'Sódio': '74mg'
            }
        },
        'embutidos': {
            name: 'Embutidos',
            info: 'Nossa linha de embutidos de frango, como linguiças e salsichas, com tempero especial.',
            nutrition: {
                'Porção': '50g (1 unidade)',
                'Valor Energético': '150 kcal',
                'Carboidratos': '1g',
                'Proteínas': '7g',
                'Gorduras Totais': '13g',
                'Sódio': '560mg'
            }
        },
        'peito-desfiado': {
            name: 'Peito Desfiado',
            info: 'Praticidade para suas receitas. Frango já cozido e desfiado, pronto para usar.',
            nutrition: {
                'Porção': '100g',
                'Valor Energético': '172 kcal',
                'Carboidratos': '0g',
                'Proteínas': '25g',
                'Gorduras Totais': '7.8g',
                'Sódio': '82mg'
            }
        },
        'linguica-mista': {
            name: 'Linguiça Mista',
            info: 'Uma combinação saborosa de carnes selecionadas, perfeita para o churrasco.',
            nutrition: {
                'Porção': '50g (1 gomo)',
                'Valor Energético': '180 kcal',
                'Carboidratos': '0.5g',
                'Proteínas': '9g',
                'Gorduras Totais': '16g',
                'Sódio': '600mg'
            }
        }
    };

    // 2. Selecionar elementos do DOM
    const productCards = document.querySelectorAll('.category-card');
    const productModal = document.getElementById('product-modal');
    const productModalBody = document.getElementById('product-modal-body');
    const closeProductModalButton = document.querySelector('.product-modal-close');

    // 3. Função para abrir o modal com os dados do produto
    const openProductModal = (productId) => {
        const product = productsData[productId];
        if (!product) return;

        let tableHTML = '<table class="nutritional-table"><tr><th colspan="2">Informação Nutricional</th></tr>';
        for (const [key, value] of Object.entries(product.nutrition)) {
            tableHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
        tableHTML += '</table>';

        productModalBody.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.info}</p>
            ${tableHTML}
        `;
        productModal.style.display = 'block';
    };

    // 4. Adicionar eventos de clique aos cards de produto
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.productId;
            if (productId) openProductModal(productId);
        });
    });

    // 5. Funções para fechar o modal
    const closeProductModal = () => { productModal.style.display = 'none'; };
    if (closeProductModalButton) closeProductModalButton.addEventListener('click', closeProductModal);
    window.addEventListener('click', (event) => { if (event.target == productModal) closeProductModal(); });
});