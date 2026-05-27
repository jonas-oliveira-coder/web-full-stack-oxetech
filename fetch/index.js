async function BuscaPost() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) {
            throw new Error(`Erro na API! Status HTTP: ${response.status}`);
        }
        const data = await response.json();
        const grid = document.querySelector('.grid');
        grid.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const element = data[i];
            const card = document.createElement('div');
            card.className = 'bg-gray-100 p-4 rounded-lg';
            card.innerHTML = `
                <h1 class="text-2xl font-bold">${element.title}</h1>
                <p class="text-gray-600">${element.body}</p>
            `;
            grid.appendChild(card);
        }

    } catch (error) {
        console.error("Ocorreu um erro:", error.message);
        document.getElementById('title').innerText = "Erro ao carregar dados";
        document.getElementById('body').innerText = "Não foi possível carregar as informações.";
    }
}
BuscaPost();
