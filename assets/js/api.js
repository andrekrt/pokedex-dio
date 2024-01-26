const pokeApi= {};

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon();
    
    pokemon.num=pokeDetail.id;
    pokemon.name=pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot)=>typeSlot.type.name);
    const [typePrincipal]=types;

    pokemon.types=types;
    pokemon.typePrincipal=typePrincipal;

    pokemon.img = pokeDetail.sprites.other.dream_world.front_default;

    pokemon.hp= pokeDetail.stats[0].base_stat;
    pokemon.attack= pokeDetail.stats[1].base_stat;
    pokemon.defense= pokeDetail.stats[2].base_stat;
    pokemon.spAtk= pokeDetail.stats[3].base_stat;
    pokemon.spDef= pokeDetail.stats[4].base_stat;
    pokemon.speed= pokeDetail.stats[5].base_stat;

    return pokemon;
}


function detalhar(idPokemon){
    const url = `https://pokeapi.co/api/v2/pokemon/${idPokemon}/`;

    return fetch(url).then((response)=>response.json())
    .then(convertPokeApiDetailToPokemon)
    
}


pokeApi.getPokemonDetail = (pokemon)=>{
    return fetch(pokemon.url).then((response)=>response.json())
    .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset=0, limit=5) => {

    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;

    return fetch(url).then((response)=>response.json())
        .then((jsonBody)=>jsonBody.results)
        .then((pokemons)=>pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests)=>Promise.all(detailRequests))
        .then((pokemonsDetails)=>pokemonsDetails)   
}
