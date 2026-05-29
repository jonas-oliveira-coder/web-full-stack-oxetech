// URL Oficial da API CoinGecko para as 10 principais moedas em USD
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// Estado global da aplicação
let cryptoCoins = [];

// Elementos do DOM
const cryptoGrid = document.getElementById('crypto-grid');
const errorState = document.getElementById('error-state');

/**
 * Função para buscar os dados de criptomoedas da API real CoinGecko
 */
async function fetchCryptoData() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro de resposta HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            cryptoCoins = data;
            if (errorState) errorState.classList.add('hidden');
        } else {
            throw new Error("Formato de resposta inválido da API");
        }

    } catch (error) {
        console.error("Falha ao buscar dados de criptomoedas da API:", error.message);
        if (errorState) errorState.classList.remove('hidden');
    } finally {
        processAndRender();
    }
}

/**
 * Formata valores numéricos brutos em Moeda USD legível
 */
function formatCurrency(value) {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value < 1 ? 4 : 2,
        maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
}

/**
 * Processa e renderiza os dados na tela
 */
function processAndRender() {
    renderGrid(cryptoCoins);
}

/**
 * Renderiza o Grid de cartões de criptomoedas com manipulação dinâmica de DOM e Estilos
 */
function renderGrid(coinsList) {
    // Limpa o contêiner
    cryptoGrid.innerHTML = '';

    // Renderiza cada moeda individualmente
    coinsList.forEach(coin => {
        const priceChange = coin.price_change_percentage_24h || 0;
        const isUp = priceChange >= 0;
        
        // Criação dinâmica do card
        const card = document.createElement('article');
        
        // --- ALTERAÇÃO DO TOM DO ELEMENTO DINAMICAMENTE COM JAVASCRIPT ---
        // Se a moeda SUBIU: bordas e efeitos com tons verde
        // Se a moeda DESCEU: bordas e efeitos com tons vermelho
        const toneBorderClass = isUp 
            ? 'hover:border-emerald-800/40' 
            : 'hover:border-rose-800/40';

        card.className = `bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 hover:shadow-lg transition duration-200 ${toneBorderClass}`;
        
        // Detalhe superior colorido dinâmico (Glow no topo do card)
        const glowLineClass = isUp ? 'bg-emerald-500/30' : 'bg-rose-500/30';
        
        // Formata preços máximos e mínimos das últimas 24h
        const highPrice = formatCurrency(coin.high_24h);
        const lowPrice = formatCurrency(coin.low_24h);
        const formattedPrice = formatCurrency(coin.current_price);
        
        // Badge de variação com seta
        const badgeColor = isUp ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' : 'bg-rose-950/80 text-rose-400 border border-rose-800/50';
        const badgeArrow = isUp ? '↑' : '↓';
        const formattedChange = `${badgeArrow} ${Math.abs(priceChange).toFixed(2)}%`;

        card.innerHTML = `
            <!-- Barra sutil de brilho superior baseada no tom dinâmico -->
            <div class="absolute top-0 left-0 right-0 h-1.5 ${glowLineClass} opacity-80"></div>

            <div class="flex items-center justify-between mb-4 mt-1">
                <div class="flex items-center gap-3">
                    <img src="${coin.image}" alt="${coin.name}" class="w-10 h-10 rounded-full object-contain filter brightness-105" loading="lazy">
                    <div>
                        <h2 class="font-bold text-white tracking-tight group-hover:text-zinc-100 transition">${coin.name}</h2>
                        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                            ${coin.symbol}
                        </span>
                    </div>
                </div>
                <!-- Badge de variação de preço -->
                <span class="text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${badgeColor}">
                    ${formattedChange}
                </span>
            </div>

            <!-- Preço Atual -->
            <div class="my-4">
                <p class="text-xs text-zinc-500 uppercase tracking-wider">Preço Atual</p>
                <div class="text-2xl font-extrabold tracking-tight text-white mt-0.5">
                    ${formattedPrice}
                </div>
            </div>

            <!-- Dados Adicionais com flexbox responsivo -->
            <div class="grid grid-cols-2 gap-4 border-t border-zinc-800/60 pt-4 mt-2 text-xs">
                <div>
                    <span class="block text-zinc-500">Máxima 24h</span>
                    <span class="font-medium text-zinc-300 mt-0.5 block">${highPrice}</span>
                </div>
                <div>
                    <span class="block text-zinc-500">Mínima 24h</span>
                    <span class="font-medium text-zinc-300 mt-0.5 block">${lowPrice}</span>
                </div>
            </div>

            <div class="border-t border-zinc-800/40 pt-3 mt-3 flex justify-between items-center text-[10px] text-zinc-500">
                <span>Rank #${coin.market_cap_rank}</span>
                <span>Cap. de Mercado: ${formatCurrency(coin.market_cap)}</span>
            </div>
        `;

        cryptoGrid.appendChild(card);
    });
}

// Inicialização imediata ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    fetchCryptoData();
});
