const setInput = document.querySelector("#exercicos");
const setButton = document.querySelector(".set-button");
const setList = document.querySelector(".set-list");
//const filterOption = document.querySelector(".filter-set");

document.addEventListener("DOMContentLoaded", getLocalSets);
setButton.addEventListener("click", addSet);
setList.addEventListener("click", deleteCheck);
//filterOption.addEventListener("change", filterSet);


//setando os seletores e capturando seus valores
const selectData = document.querySelector("#data");
const selectExercicio = document.querySelector("#exercicio");
const selectCarga = document.querySelector("#carga");
const selectRepeticoes = document.querySelector("#repeticoes");

selectExercicio.addEventListener("change", exibirValorExercicico);
selectCarga.addEventListener("change", exibirValorCarga);
selectRepeticoes.addEventListener("change", exibirValorRepeticoes);

function dataChangeValue() {
    return selectData.value;
}
function exercicoChangeValue() {
    return selectExercicio.value;
}
function cargaChangeValue() {
    return selectCarga.value;
}
function repeticoesChangeValue() {
    return selectRepeticoes.value;
}

//Adiciona set no localstorage
function addSet(event) {
    setInfos = []
    setInfos.push(dataChangeValue())
    setInfos.push(exercicoChangeValue())
    setInfos.push(cargaChangeValue())
    setInfos.push(repeticoesChangeValue())

    event.preventDefault();

    const setDiv = document.createElement("div");
    setDiv.classList.add("set");
    
    const newSet = document.createElement("li");
    newSet.classList.add("set-item");

    const data = document.createElement("div")
    data.innerText = setInfos[0]
    data.classList.add("set-item-tipo")
    const carga = document.createElement("div")
    carga.innerText = setInfos[1]
    carga.classList.add("set-item-tipo")
    const peso = document.createElement("div")
    peso.innerText = setInfos[2]
    peso.classList.add("set-item-tipo")
    const repeticoes = document.createElement("div")
    repeticoes.innerText = setInfos[3]
    repeticoes.classList.add("set-item-tipo")

    //newSet.innerText = set[0];
    newSet.appendChild(data)
    newSet.appendChild(carga)
    newSet.appendChild(peso)
    newSet.appendChild(repeticoes)

    setDiv.appendChild(newSet);
    

    //salva valores no localstorage
    saveLocalSets(setInfos);//ta aqui ó

    //botão de check deixa ele aqui vai q é util ter um botão ali tipo um alterar
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
    completedButton.classList.add("complete-btn");
    setDiv.appendChild(completedButton);

    //ignore por enquanto
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></li>';
    trashButton.classList.add("trash-btn");
    setDiv.appendChild(trashButton);
    
    //adiciona a div
    setList.appendChild(setDiv);
    setInput.value = "";
    
}

function saveLocalSets(arraySet){
    let sets;
    if (localStorage.getItem("sets") === null) {
        sets = [];
    } else {
        sets = JSON.parse(localStorage.getItem("sets"));
    }
    sets.push(arraySet);  //Adicionar cada elemento do array
    localStorage.setItem("sets", JSON.stringify(sets));
}

//ta pegando como texto tem q ser como array e separar
function getLocalSets() {
    let sets;
    if(localStorage.getItem("sets") === null) {
        sets = [];
    } else {
        sets = JSON.parse(localStorage.getItem("sets"));
    }
    sets.forEach(function(set) {
        const setDiv = document.createElement("div");
        
        setDiv.classList.add("set");
        const newSet = document.createElement("li");
        
        //adiciona elementos do formulario
        const data = document.createElement("div")
        data.innerText = set[0]
        data.classList.add("set-item-tipo")
        const carga = document.createElement("div")
        carga.innerText = set[1]
        carga.classList.add("set-item-tipo")
        const peso = document.createElement("div")
        peso.innerText = set[2]
        peso.classList.add("set-item-tipo")
        const repeticoes = document.createElement("div")
        repeticoes.innerText = set[3]
        repeticoes.classList.add("set-item-tipo")

        newSet.appendChild(data)
        newSet.appendChild(carga)
        newSet.appendChild(peso)
        newSet.appendChild(repeticoes)


        newSet.classList.add("set-item");
        setDiv.appendChild(newSet);

        const completedButton = document.createElement("button");
        completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
        completedButton.classList.add("complete-btn");
        setDiv.appendChild(completedButton);

        const trashButton = document.createElement("button");
        trashButton.innerHTML = '<i class="fas fa-trash"></li>';
        trashButton.classList.add("trash-btn");
        setDiv.appendChild(trashButton);

        setList.appendChild(setDiv);
    });
}



//ta funfando direitinho nem precisa mudar mt coisa
function deleteCheck(e) {
    const item = e.target;

    if(item.classList[0] === "trash-btn") {
        const set = item.parentElement;
        set.classList.add("slide");

        removeLocalSets(set);
        set.addEventListener("transitionend", function() {
            set.remove();
        });
    }

    if(item.classList[0] === "complete-btn") {
        const set = item.parentElement;
        set.classList.toggle("completed");
    }
}

function removeLocalSets(set) {
    let sets;
    if(localStorage.getItem("sets") === null) {
        sets = [];
    } else {
        sets = JSON.parse(localStorage.getItem("sets"));
    }

    const setIndex = set.children[0].innerText;
    sets.splice(sets.indexOf(setIndex), 1);
    localStorage.setItem("sets", JSON.stringify(sets));
}