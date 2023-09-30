document.addEventListener("DOMContentLoaded", () => {
  const numberOfPokemon = 151; // VARIABLE CON EL NUMERO DE POKEMONES DE LA PRIMERA GENERACION
  const pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/";
  function pokemonImg(pokemonId) {
    const pokemonGetImg = pokemonNumber(pokemonId);
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokemonGetImg}.png`;
  }
  function pokemonNumber(number) {
    return String(number).padStart(3, "0");
  }
  function pokemonDetails(pokemonId) {
    return fetch(`${pokeApiUrl}${pokemonId}/`).then((response) =>
      response.json()
    );
  }
  //DECLARA EN UNA VARIABLE LAS PROMESAS EN UN OBJETO VACIO
  const pokemonPromises = []; //

  Array.from({ length: numberOfPokemon }, (_, index) => {
    const pokemonId = index + 1;
    pokemonPromises.push(pokemonDetails(pokemonId)); // SE PUSHEAN LAS PROMESAS EN LA VARIABLE
  });

  // DECLARA LA VARIABLE POKEDEX CON UN ARREGLO VACIO, SE USA LET POR QUE SE VA A ESTAR SOBREESCRIBIENDO LA VARIABLE
  let pokedex = [];
  // DECLARA LA VARIABLE POKEDEX CON UN ARREGLO VACIO, SE USA LET POR QUE SE VA A ESTAR SOBREESCRIBIENDO LA VARIABLE
  let pokemonIndex = 0;

  //SI TODAS LAS PROMESAS SE CUMPLEN, SE CREA LA POKEMON CARD
  Promise.all(pokemonPromises)
    .then((pokemonDetails) => {
      pokedex = pokemonDetails;
      createPokemonCards(pokedex, pokemonIndex);
    })
    //SI ALGUNA PROMESA NO SE CUMPLE, SE MUESTRA UN ERROR
    .catch((error) =>
      console.error("Error al realizar la solicitud a la API:", error)
    );

  //FUNCION PARA CREAR LAS TARJETAS DEL CADA POKEMON Y DESPLEGARLAS EN EL POKEDEX
  function createPokemonCards(pokemonList, index) {
    const pokemon = pokemonList[index];

    //SE REALIZA UN GET PARA CREAR UNA VARIABLE CON EL ID DEL HTML
    const pokemonImgDiv = document.getElementById("pokemonImage");
    const pokemonType = document.getElementById("pokemonTypeValue");
    const pokemonId = document.getElementById("pokemonIdValue");
    const pokemonInfo = document.getElementById("pokemonInfo");

    // SE CREA UN ELEMENTO DE IMG
    const pokemonIMG = document.createElement("img");
    pokemonIMG.src = pokemonImg(pokemon.id);

    // LIMPIA EL ELEMENTO IMG PASADO CON UN ARRAY VACIO Y AGREGA UNO NUEVO, AL HACER RELOAD
    pokemonImgDiv.innerHTML = "";
    pokemonImgDiv.appendChild(pokemonIMG);

    const pokemonNameDiv = document.getElementById("pokemonName");
    pokemonNameDiv.textContent = capSecond(pokemon.name);

    // LIMPIA EL ELEMENTO  PASADO CON UN ARRAY VACIO Y AGREGA UNO NUEVO, AL HACER RELOAD
    pokemonType.innerHTML = "";

    //OBTENER EL TYPE DEL POKEMON Y HACER UN JOIN CON BR PARA GENERAR UN SALTO DE LINEA
    const typesArray = pokemon.types.map((type) => capFirst(type.type.name));
    const typesText = typesArray.join("<br>");

    //CREA UN PARRAFO CON EL TYPE DE POKEMON
    const type = document.createElement("p");
    type.innerHTML = typesText;

    //SE AGREGA EL TYPE AL POKEDEX
    pokemonType.appendChild(type);

    // OBTENER EL ID DEL POKEMON Y ESCRIBIRLO EN EL PARRAFO CREADO
    pokemonId.innerHTML = `<p># ${pokemon.id}</p>`;

    //OBTENER LAS HABILIDADES DEL POKEMON Y HACER UN JOIN CON ,
    const abilitiesArray = pokemon.abilities.map((ability) =>
      capFirst(ability.ability.name)
    );
    const abilitiesText = abilitiesArray.join(", ");

    // DESPLEGAR TODA LA INFORMACION DEL POKEMON EN UN SOLO DIV ACCEDIENDO A LAS DISTINTAS PROPIEDADES EN EL POKEDEX
    pokemonInfo.innerHTML = `<p>Height: ${
      pokemon.height / 10
    } M</p><p>Weight: ${
      pokemon.weight / 10
    } KG</p><p>Abilities: ${abilitiesText}</p>`;
  }

  //Con esta funcion transforme la primer letra en mayuscula
  function capFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Con esta funcion transforme la primer letra en mayuscula seguida de la que palabra contiene un guión ("-")
  function capSecond(name) {
    return name
      .split("-")
      .map((part) => capFirst(part))
      .join("-");
  }

  // Agregar listener para el botón "next"
  const nextButtons = document.getElementsByClassName("right");

  // Agregar un evento a cada botón "Next Pokémon"
  for (const nextButton of nextButtons) {
    nextButton.addEventListener("click", () => {
      if (pokemonIndex < pokedex.length - 1) {
        pokemonIndex++;
        createPokemonCards(pokedex, pokemonIndex);
      }
    });
  }

  // Obtén una colección de elementos con la clase "left" (botón "Previous Pokémon")
  const prevButtons = document.getElementsByClassName("left");

  // Agregar un evento a cada botón "Previous Pokémon"
  for (const prevButton of prevButtons) {
    prevButton.addEventListener("click", () => {
      if (pokemonIndex > 0) {
        pokemonIndex--;
        createPokemonCards(pokedex, pokemonIndex);
      }
    });
  }
});
