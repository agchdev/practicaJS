// VARIABLES Y CONSTANTES
let selectorCategorias = document.querySelector('#categorias select');
let row = document.querySelector("#recetas .row");
let favs = JSON.parse(localStorage.getItem("fav")) || []

function obtenerDatos(url){
    return fetch(url)
    .then(respuesta => respuesta.json());
}

function cargarCategorias() {
    const url1 = "https://www.themealdb.com/api/json/v1/1/categories.php";
    obtenerDatos(url1)
    .then(datos => {
        datos.categories.forEach(dato => {
            // console.log(dato.strCategory)   
            selectorCategorias.innerHTML += `
            <option value="${dato.strCategory}">${dato.strCategory}</option>
            `;            
        });
    })

}

// selectorCategorias.addEventListener('change', (e) => {
//     console.log(e.target.value)
//     let cat = e.target.value;
//     mostrarRecetasDeCateg(cat);
// })

// FUNCION PARA CARGAR CATEGORIAS - DATOS DEL SELECT
function mostrarRecetasDeLaCategoria(cat){
    const url2 ="https://www.themealdb.com/api/json/v1/1/filter.php?c="+cat;
    // console.log(url2);
    row.innerHTML = '';

    obtenerDatos(url2)
    .then( datos => {
        // console.log(datos);
        datos.meals.forEach(dato => {
            row.innerHTML += `
            <div class="col-md-4">

                <div class="card text-white bg-primary mb-3">
                    <div class="card-header">
                        <img src="${dato.strMealThumb}" class="img-fluid"/>    
                    </div>
                    <div class="card-body">
                        <h4 class="card-title">${dato.strMeal}</h4>
                        <button type="button" onclick="mostrarReceta(${dato.idMeal})" class="btn btn-danger w-100" data-bs-toggle="modal" data-bs-target="#emergente">
                            Ver receta
                        </button>
                    </div>
                </div>
                
            </div>
            `;
        })
    })
}

// ABRIR EMERGENTE
function mostrarReceta(idReceta){
    const url3 = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
    let emergenteLabel = document.querySelector("#emergenteLabel");
    let emergenteIMG = document.querySelector("#emergente img");
    let emergenteUL = document.querySelector("#emergente ul");
    let emergenteP = document.querySelector("#emergente p");
    let modalFooter = document.querySelector(".modal-footer")
    emergenteUL.innerHTML = '';
    // console.log(url3);
    obtenerDatos(url3)
    .then(receta => {
        // console.log(receta.meals[0])
        emergenteP.textContent = receta.meals[0].strInstructions;
        emergenteLabel.textContent = receta.meals[0].strMeal;
        emergenteIMG.src = receta.meals[0].strMealThumb;
        for (let i = 1; i <= 20; i++) {
            if(receta.meals[0][`strIngredient${i}`] != "" && receta.meals[0][`strIngredient${i}`] != null){
                const li = document.createElement("li")
                li.textContent = receta.meals[0][`strIngredient${i}`] + " - " + receta.meals[0][`strMeasure${i}`];
                emergenteUL.append(li)
            }
        }
        
        modalFooter.innerHTML = `
            <button onclick="añadirFavoritos(${idReceta})" id="btnFav" type="button" class="btn btn-primary w-50">Guardar Favoritos</button>
            <button type="button" class="btn btn-success w-50" data-bs-dismiss="modal">Cerrar</button>
        `;
        textBtnFavs(idReceta);
    })
};

function textBtnFavs(idReceta){
    const btnFav = document.querySelector("#btnFav");
    if (!compuebaFavs(favs, idReceta)){ 
        btnFav.textContent = "Guardar Favoritos";
    }else{
        btnFav.textContent = "Eliminar Favoritos";
    };
}

function eliminarReceta(idReceta){
    let cont = 0;
    let elim = false;
    for (const fav of favs) {
        if (fav.idMeal == idReceta) {
            console.log(fav.idMeal+" - "+idReceta)
            elim = true;
            break;
        }
        cont++;
    }
    console.log(cont);
    if(elim) favs.splice(cont, 1);
    console.log(favs);
    localStorage.setItem("fav", JSON.stringify(favs));
    textBtnFavs(idReceta);
}

// async function getDatos(url3){
//     const urlFetch = await fetch(url3);
//     const datos = await urlFetch.json();
//     console.log(datos.meals[0]);
//     return datos.meals[0];
// }

function añadirFavoritos(idReceta){
    console.log(idReceta)
    const url3 = "https://www.themealdb.com/api/json/v1/1/lookup.php?i="+idReceta;
    fetch(url3)
    .then( respuesta => respuesta.json())
    .then( datos => {
        // console.log(datos.meals[0]);
        if (!compuebaFavs(favs, idReceta)){ 
            favs.push(datos.meals[0])
            almacenarLocal();
            const divSucces = document.createElement("div");
            divSucces.innerHTML = `
                <div class="alert alert-dismissible position-fixed alert-success top-5 m-auto z-3">
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    <strong>Añadido a Favoritos</strong> You successfully read <a href="favoritos.html" class="alert-link">Ve a ver tus favoritos</a>.
                </div>
            `;
            document.querySelector("#emergente").prepend(divSucces);
            textBtnFavs(idReceta);
        }else{ 
            eliminarReceta(idReceta);
        };
    } )
}

// FUNCION DE ALMACENAR DATOS
function almacenarLocal(){
    console.log(favs)
    localStorage.setItem("fav", JSON.stringify(favs));
}

function compuebaFavs(favs, idReceta){
    // Si encuentra un favorito con el mismo id, retorna true (ya está en favoritos)
    return favs.some(fav => fav.idMeal == idReceta);
}
console.log(window.location.href);
let locationPage = window.location.href.split("/");
let cont = locationPage.length;
console.log(locationPage[cont-1]);
if(locationPage[cont-1] == "practica.html") cargarCategorias();

