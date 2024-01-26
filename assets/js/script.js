const pokemonList = document.getElementById('pokemons');
const botoaCarregar = document.getElementById('carregarMais');
const limit = 5;
let offset = 0;
const maxPokemons = 151;

function carregaPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemonList.innerHTML += pokemons.map((pokemon) =>
            `<li class="pokemon ${pokemon.typePrincipal}" onclick="abrirModal(${pokemon.num})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" > 
            <span class="number">#${pokemon.num}</span>
            <span class="name">${pokemon.name}</span> 
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                </ol>
                <img src="${pokemon.img}" alt="${pokemon.name}">
            </div>
        </li>`
        ).join('');
    })
}

function pesquisar(){
    const pokemon = document.getElementById('search').value;
    pokemonList.innerHTML="";
    if(pokemon===""){
        carregaPokemonItens(0, 5);
    }else{
        detalhar(pokemon).then((pokemon)=>{
            pokemonList.innerHTML = `<li class="pokemon ${pokemon.typePrincipal}" onclick="abrirModal(${pokemon.num})" data-bs-toggle="modal" data-bs-target="#staticBackdrop" > 
            <span class="number">#${pokemon.num}</span>
            <span class="name">${pokemon.name}</span> 
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
                </ol>
                <img src="${pokemon.img}" alt="${pokemon.name}">
            </div>
        </li>`
        },()=>{
            pokemonList.innerHTML=`
            <div class="alert alert-danger mt-1 w-100"  role="alert">O Pokemon ${pokemon} não foi encontrado em nossa Pokedex</div>`
        }); 
    }
}

carregaPokemonItens(offset, limit);

botoaCarregar.addEventListener('click', () => {
    offset += limit;

    const qtdLimitProx = offset + limit;
    if (qtdLimitProx >= maxPokemons) {
        const newLimit = maxPokemons - offset;
        carregaPokemonItens(offset, newLimit);

        botoaCarregar.parentElement.removeChild(botoaCarregar);
    } else {
        carregaPokemonItens(offset, limit);
    }
});

// função para chamar modal de detalhes
function abrirModal(idPokemon) {
    detalhar(idPokemon).then((valores) => {
        document.getElementById('evolucoes').innerHTML="";
        document.getElementById('titlePokemon').innerHTML = valores.name;
        document.getElementById('imgPokemon').setAttribute("src", valores.img);
        document.getElementById('tipo').innerHTML = valores.typePrincipal;
        document.getElementById('tipo').setAttribute("class",valores.typePrincipal );
        document.getElementById('atributos').innerHTML = `
        <table class="table table-borderless">
            <tr>
                <td class="coluna-title">HP</td>
                <td id="hp" class="coluna-title">${valores.hp}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.hp}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Attack</td>
                <td id="attack">${valores.attack}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.attack}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Defense</td>
                <td id="defense">${valores.defense}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.defense}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Sp. Atk</td>
                <td id="spAtk">${valores.spAtk}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.spAtk}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Sp. Def</td>
                <td id="spDef">${valores.spDef}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.spDef}%"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Speed</td>
                <td id="speed">${valores.speed}</td>
                <td>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: ${valores.speed}%"></div>
                    </div>
                </td>
            </tr>
        </table>
        `;

        pegarEvolucoes(idPokemon).then((especies)=>{
            document.getElementById('evolucoes').innerHTML="";
            for(let i=0; i<especies.length; i++){
                detalhar(especies[i]).then((imagens)=>{
                    document.getElementById('evolucoes').innerHTML += `
                    <div class="evolucao-pokemon">
                        <img class="img-evolution" src="${imagens.img}" alt="Pokemon" id="imgPokemon">
                        <span>${imagens.name}</span>
                    </div>
                    ` ;
                    
                })
            }
        });
        
    });
}

async function pegarEvolucoes(idPokemon){
    const url = `https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`;
    let especies=[] ;

    try{
        const response = await fetch(url);
        const result = await response.json();
        const urlEvolution = result.evolution_chain.url;

        const resposta = await fetch(urlEvolution);
        const resultado = await resposta.json();

        especies.push(resultado.chain.species.name);
        if(resultado.chain.evolves_to[0].species.name){
            especies.push(resultado.chain.evolves_to[0].species.name);
        }
        if(resultado.chain.evolves_to[0].evolves_to[0].species.name){
            especies.push(resultado.chain.evolves_to[0].evolves_to[0].species.name); 
        }       
       

        return especies;
    }catch(erro){
        return especies;
    }
}

