import { Response } from "./Response.js"

// Botones submit de los formularios
const btnSubmitTarjeta = document.querySelector("#submitTarjeta") as HTMLButtonElement
const btnSubmitMetalico = document.querySelector("#submitMetalico") as HTMLButtonElement

// Botones para cerrar los modal
const btnCerrarModalTarjeta = document.querySelector("#btnCerrarModalTarjeta") as HTMLButtonElement
const btnCerrarModalMetalico = document.querySelector("#btnCerrarModalMetalico") as HTMLButtonElement

// Modals (tarjeta y metalico)
const modalTarjeta = document.querySelector("#modalTarjeta") as HTMLDivElement
const modalMetalico = document.querySelector("#modalMetalico") as HTMLDivElement

// Clicks 
btnSubmitTarjeta.addEventListener("click", ()=> validarInputs("tarjeta"))
btnSubmitMetalico.addEventListener("click", ()=> validarInputs("metalico"))
btnCerrarModalTarjeta.addEventListener("click", ()=> modalTarjeta.classList.add("hidden"))
btnCerrarModalMetalico.addEventListener("click", ()=> modalMetalico.classList.add("hidden"))


// Etiquetas de resultados dentro de los modal
const cantidadModalTarjeta = document.getElementById("cantidadModalTarjeta")
const numTarjetaModalTarjeta = document.getElementById("numTarjetaModalTarjeta")

const cantidadModalMetalico = document.getElementById("cantidadModalMetalico")
const cambioModalMetalico = document.getElementById("cambioModalMetalico")

// Spans error
const spanErrorTarjeta = document.getElementById("spanErrorTarjeta")
const spanErrorMetalico = document.getElementById("spanErrorMetalico")


/**
 * Comprobamos que no hayan campos vacíos y llamamos a la funcion 'validarTarjetaCredito' si el metodo de pago es 'tarjeta'. 
 * Si el metodo de pago es 'metalico' sumaremos las monedas y llamaremos al meotodo 'calcularCambio'
 */
function validarInputs(metodoPago:string) {
    console.log(metodoPago)

    if(metodoPago == "tarjeta"){
        var amount = document.getElementById("amountTarjeta") as HTMLInputElement
        var currency = document.getElementById("currencyTarjeta") as HTMLInputElement
        var cardNum = document.getElementById("cardNumTarjeta") as HTMLInputElement
        console.log(currency.value)

        if (amount.value == "" || currency.value == "" || cardNum.value == ""){
            console.log("Faltan campos por informar")
            spanErrorTarjeta?.classList.remove('hidden')
    
        }else {
            if (validarTarjetaCredito(cardNum.value)){
                console.log("Amount: " + amount.value + ", Currency:" + currency.value +  ", Card num:" +  cardNum.value)
    
                const res = new Response(true, "OK. El número de tarjeta es válido.")
                console.log(res)
                spanErrorTarjeta?.classList.add('hidden')

                if(modalTarjeta !==null){
                    modalTarjeta.classList.remove("hidden")
                    if(cantidadModalTarjeta !==null && numTarjetaModalTarjeta !== null){
                        cantidadModalTarjeta.innerHTML = "Cantidad: " + amount.value + " " + currency.value
                        numTarjetaModalTarjeta.innerHTML = "Numero de tarjeta: " + cardNum.value
                    }
                }

    
            } else {
                const res = new Response(false, "ERR. El número de tarjeta NO es válido.", 703)
                console.log(res)
            }
        }
    }

    else if(metodoPago == "metalico"){
        var amount = document.getElementById("amountMetalico") as HTMLInputElement
        var currency = document.getElementById("currencyMetalico") as HTMLInputElement

        var coin1 = document.getElementById("coin1") as HTMLInputElement
        if(isNaN(parseInt(coin1.value))) coin1.value += 0;

        var coin2 = document.getElementById("coin2") as HTMLInputElement
        if(isNaN(parseInt(coin2.value))) coin2.value += 0;

        var coin5 = document.getElementById("coin5") as HTMLInputElement
        if(isNaN(parseInt(coin5.value))) coin5.value += 0;

        var coin10 = document.getElementById("coin10") as HTMLInputElement
        if(isNaN(parseInt(coin10.value))) coin10.value += 0;

        var coin20 = document.getElementById("coin20") as HTMLInputElement
        if(isNaN(parseInt(coin20.value))) coin20.value += 0;

        var coin50 = document.getElementById("coin50") as HTMLInputElement
        if(isNaN(parseInt(coin50.value))) coin50.value += 0;

        var coin100 = document.getElementById("coin100") as HTMLInputElement
        if(isNaN(parseInt(coin100.value))) coin100.value += 0;

        var coin500 = document.getElementById("coin500") as HTMLInputElement
        if(isNaN(parseInt(coin500.value))) coin500.value += 0;


        let total:number = parseInt(coin1.value) *1 + parseInt(coin2.value) *2 + parseInt(coin5.value) *5 + parseInt(coin10.value) *10
        + parseInt(coin20.value) *20 + parseInt(coin50.value) *50 + parseInt(coin100.value) *100 + parseInt(coin500.value) *500

        let cambio:number = total - parseInt(amount.value)
    
        // Si faltan campos por informar
        if (amount.value == "" || currency.value == ""){
            if(spanErrorMetalico !== null){
                spanErrorMetalico.classList.remove('hidden')
                spanErrorMetalico.innerHTML = "Faltan campos por informar"
            }
            console.log("Faltan campos por informar")
    
        
        // Si no hay suficientes monedas para igualar la cantidad
        }else if (total < parseInt(amount.value)){
            if(spanErrorMetalico !== null){
                spanErrorMetalico.classList.remove('hidden')
                spanErrorMetalico.innerHTML = "Faltan monedas por introducir"
            }
            console.log("Faltan monedas por introducir")


        // Si todo ha ido bien, calculamos el cambio
        }else{
            console.log("total: " + total)
            console.log("El cambio es de: " + cambio +" " + currency.value)
            spanErrorMetalico?.classList.add('hidden')

            calcularCambio(cambio)

            if(modalMetalico !==null){
                modalMetalico.classList.remove("hidden")
                if(cantidadModalMetalico !==null && cambioModalMetalico !==null){
                    cantidadModalMetalico.innerHTML = "Cantidad: " + amount.value + " " + currency.value
                    cambioModalMetalico.innerHTML = "Cambio: " + cambio + " " + currency.value
                }
            }
        }
    }
}







/**
 * Valida la tarjeta de credito introducida.
 *  1. Tenemos una tarjeta con el num: 45112
 *  2. Invertimos el numero: 21154
 *  3. Cojemos UN numero cada 2 posiciones y lo multiplicamos por si mismo: 2 [1] 1 [5] 4 --> 2 [2] 1 [10] 4
 *  4. Sumamos los digitos: 2 + 2 + 1 + 1 + 0 + 4
 *  5. Si el resultado termina con 0 (es divisible por 10), es que es valido
 * @param numeroTarjeta 
 */
function validarTarjetaCredito(numeroTarjeta:string) {
    // Convertir el número de tarjeta a una cadena y eliminar los espacios
    const tarjeta = numeroTarjeta.toString().replace(/\D/g, '');

    let suma = 0;
    let esSegundoDigito = false;

    // Recorremos el número de tarjeta desde el final hacia el inicio
    for (let i = tarjeta.length - 1; i >= 0; i--) {
        let digito = parseInt(tarjeta[i]);

        if (esSegundoDigito) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }

        suma += digito;
        esSegundoDigito = !esSegundoDigito;
    }

    // Si la suma es divisible por 10, el número es válido
    return (suma % 10) === 0;
}



/**
 * Calcula la cantidad de monedas a retornar de cada tipo.
 * @param cambio 
 * @returns resultado
 */
function calcularCambio(cambio:number){

    // Tipos de monedas
    const monedas = [ 500 , 100, 50, 20, 10, 5, 2 , 1 ];

    // Objeto con las monedas que se necesitan 
    const resultado:any = {};

    for (let i = 0; i < monedas.length; i++) {
        let tipoMoneda = monedas[i];

        // Si la cantidad es mayor o igual que el tipo de moneda actual
        if (cambio >= tipoMoneda) {

            // Calcular cuántas monedas de ese tipo se necesitan
            let cantidadMonedas = Math.floor(cambio / tipoMoneda);  // 120 / 500 = 0.24

            // Guardar el tipo de moneda actual con la cantidad que se usan
            resultado[tipoMoneda.toFixed(2)] = cantidadMonedas;

            // Reducir la cantidad que queda por devolver
            cambio -= cantidadMonedas * tipoMoneda;

            // Redondear a dos decimales para evitar problemas con decimales en JavaScript
            //cambio = Math.round(cambio * 100) / 100;
        }
    }
        console.log(resultado)
        return resultado;
}
