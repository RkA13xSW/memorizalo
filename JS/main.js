//! VARIABLES GLOBALES:
//Cantidad de cartas
let cantidad = 1;
//Dificultad de la partida
let dificultad = 1;
//Cartas descubiertas
let descubiertas = 0; 
//Intentos realizados por el jugaodor
let intentos = 0;
//Numeros de la baraja
const NUMEROS = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece"];
//Figuras posibles
const FIGURAS = ["corazones", "picas", "diamantes", "treboles"];
//Figuras generadas aleatoriamente.
let CARTASFIGURAS = [];
//Contabilización para el control de la aleatoriedad de la generación de cartas.
let CARTASCANTIDAD = [];
//Tiempo del temporizador.
let tiempo = [0,0,0];
//Intervalo del temporizador.
let intervalo;
//Cartas levantadas
let cartasSeleccionadas = -1;
//Recuento de cartas encontradas:
let cartasEncontradas = [];

//!INICIALIZA LOS DATOS DE LA PARTIDA
function iniciarDatos(){
    const CANTIDAD = parseInt(document.getElementById("cantidad").value);
    const DIFICULTAD = parseInt(document.getElementById("dificultad").value);
    cantidad = (isNaN(CANTIDAD) || (CANTIDAD < 1 && CANTIDAD > 13)) ? 1 : CANTIDAD;
    dificultad = (isNaN(DIFICULTAD) || (DIFICULTAD < 1 && DIFICULTAD > 4)) ? 1 : DIFICULTAD;

    iniciarJuego();
}

//!INICIALIZA LAS CARTAS DEL JUEGO.
function iniciarJuego(){    
    //MOSTRAMOS LA CAJA
    const FORM = document.querySelector(".menu-selector");
    const JUEGO = document.querySelector(".juego");
    FORM.classList.add("noVer");
    JUEGO.classList.remove("noVer");

    //CREACIÓN DE ELEMENTOS:
    cantidadCartas = (cantidad * dificultad)*2;
    let idxCartas = 0;

    do {
        const color = Math.floor(Math.random() * dificultad);
        const numero = Math.floor(Math.random() * cantidad);

        let cartaEncontrada = NUMEROS[numero]+FIGURAS[color];



        if(CARTASFIGURAS.indexOf(cartaEncontrada) > -1 ){
            if(CARTASCANTIDAD[CARTASFIGURAS.indexOf(cartaEncontrada)] < 2){
                CARTASCANTIDAD[CARTASFIGURAS.indexOf(cartaEncontrada)]++;
                idxCartas++;
                aniadirCarta(cartaEncontrada, idxCartas);
            }

        }else{

            CARTASFIGURAS.push(cartaEncontrada);
            CARTASCANTIDAD.push(1);
            idxCartas++;
            aniadirCarta(cartaEncontrada, idxCartas);

        }
    }while(CARTASFIGURAS.length < (cantidad * dificultad) || CARTASCANTIDAD.includes(1));


    intervalo = setInterval(contador, 1000);
    intervalo;
}

//!AÑADE CARTAS AL JUEGO
function aniadirCarta(carta, idx){
    const CAJAJUEGO = document.querySelector(".juego-cartas");
    const caja = document.createElement("div");
        caja.classList.add("carta");
        caja.addEventListener("click", ()=>{gestionarCarta(idx)})


    const imgBack = document.createElement("img");
        imgBack.src = "./IMGS/backcarta.png";
        imgBack.classList.add("carta-back");

    const imgCarta = document.createElement("img");
        imgCarta.src = `./IMGS/${carta}.png`;
        imgCarta.classList.add("carta-img");
        imgCarta.classList.add("noVer");

    caja.appendChild(imgBack);
    caja.appendChild(imgCarta);
    CAJAJUEGO.appendChild(caja);

}

//!Contador de juego
function contador(){
    const TIEMPO = document.getElementById("tiempo");
    if(tiempo[2] < 59){

        tiempo[2]++;

    }else if(tiempo[1] < 59){

        tiempo[1]++;
        tiempo[2] = 0;

    }else{
        tiempo[0]++;
        tiempo[1] = 0;
        tiempo[2] = 0;
    }
    let tiempoStr = [
        (tiempo[0] < 10)? `0${tiempo[0]}`: tiempo[0],
        (tiempo[1] < 10)? `0${tiempo[1]}`: tiempo[1],
        (tiempo[2] < 10)? `0${tiempo[2]}`: tiempo[2]
    ]
    TIEMPO.innerText = "" + tiempoStr[0] + ":" + tiempoStr[1] + ":" + tiempoStr[2];
}

//!MUESTRA/OCULTA y lleva cuentas de las cartas
function gestionarCarta(idx){
    const DORSO = document.querySelectorAll(".carta-back")[idx-1];
    const CARTALEVANTADA = document.querySelectorAll(".carta-img")[idx-1];

    if(cartasEncontradas.indexOf(idx-1) == -1){
        if(!DORSO.classList.contains("noVer")){
            if(cartasSeleccionadas == -1){
                cartasSeleccionadas = idx-1;
            }else if(cartasSeleccionadas != (idx - 1)){
                const CARTAANTERIOR = document.querySelectorAll(".carta-img")[cartasSeleccionadas];
                let srcAnterior = CARTAANTERIOR.src;
                let srcActual = CARTALEVANTADA.src;
                if(srcAnterior === srcActual){
                    const DESCUBIERTAS = document.getElementById("cartas-descubiertas");
                    descubiertas++;
                    cartasEncontradas.push(cartasSeleccionadas);
                    cartasEncontradas.push(idx-1);
                    if(cartasEncontradas.length == (dificultad * cantidad * 2)){
                        alertaVictoria();
                    }

                    DESCUBIERTAS.innerText = descubiertas;
                    cartasSeleccionadas = -1;
                }else{
                    const DORSOANTERIOR = document.querySelectorAll(".carta-back")[cartasSeleccionadas];
    
                    setTimeout(()=>{
                        DORSO.classList.toggle("noVer");
                        CARTALEVANTADA.classList.toggle("noVer");
                        DORSOANTERIOR.classList.toggle("noVer");
                        CARTAANTERIOR.classList.toggle("noVer");
                        cartasSeleccionadas = -1;
                    }, 500);
    
                }
                const INTENTOS = document.getElementById("intentos");
                intentos++;
                INTENTOS.innerText = intentos;
            }
        }else if(cartasSeleccionadas != -1){
            cartasSeleccionadas = -1;
        }
        DORSO.classList.toggle("noVer");
        CARTALEVANTADA.classList.toggle("noVer");
    }
}

//!MENSAJE VICTORIA.
function alertaVictoria(){
    clearInterval(intervalo);
    const VICTORIA = document.querySelector(".alerta-victoria");
    const TIEMPO = document.getElementById("tiempoVictoria");
    const REVELADAS = document.getElementById("encontradasVictoria");
    const INTENTOS = document.getElementById("intentosVictoria");



    VICTORIA.classList.toggle("noVer");
    let tiempoStr = [
        (tiempo[0] < 10)? `0${tiempo[0]}`: tiempo[0],
        (tiempo[1] < 10)? `0${tiempo[1]}`: tiempo[1],
        (tiempo[2] < 10)? `0${tiempo[2]}`: tiempo[2]
    ];
    TIEMPO.innerText = "" + tiempoStr[0] + ":" + tiempoStr[1] + ":" + tiempoStr[2];
    REVELADAS.innerText = descubiertas;
    INTENTOS.innerText = intentos;
}

//!Reiniciar parametros:
function volverAJugar(){
    intentos = 0;
    descubiertas = 0;
    tiempo = [0,0,0];
    CARTASFIGURAS = [];
    CARTASCANTIDAD = [];
    cartasSeleccionadas = -1;
    cartasEncontradas = [];

    const DESCUBIERTAS = document.getElementById("cartas-descubiertas");
    DESCUBIERTAS.innerText = 0;
    const INTENTOS = document.getElementById("intentos");
    INTENTOS.innerText = 0;

    const JUEGO = document.querySelector(".juego-cartas");
    var child = JUEGO.lastElementChild; 
    while (child) {
        JUEGO.removeChild(child);
        child = JUEGO.lastElementChild;
    }

    const VICTORIA = document.querySelector(".alerta-victoria");
    VICTORIA.classList.toggle("noVer");

    iniciarJuego();
}