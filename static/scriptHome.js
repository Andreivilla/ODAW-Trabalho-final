  // Função para fazer a requisição do arquivo JSON
  function loadJSON(callback) {
    const xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "servidorquedevemandar/exercicios.json", true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState === 4 && xobj.status === 200) {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  // Função para criar o gráfico com base nos dados do JSON
  function createChart(jsonData, exercicio, numBarras) {
    // Dados do JSON
    const data = JSON.parse(jsonData);

    // Encontrar o objeto do exercício selecionado
    const exercicioData = data.historico_cargas.find(item => item.nome === exercicio);

    // Obter as datas e volumes do exercício selecionado
    const datas = exercicioData.datas.slice(0, numBarras);
    const volumes = exercicioData.volume.slice(0, numBarras);

    // Verificar se o gráfico já existe e destruí-lo antes de criar um novo
    const existingChart = Chart.getChart("myChart");
    if (existingChart) {
      existingChart.destroy();
    }

    // Criar gráfico de colunas
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: datas,
        datasets: [{
          label: exercicio,
          data: volumes,
          backgroundColor: getRandomColor(),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Volume de cargas por exercício"
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Volume"
            }
          },
          x: {
            title: {
              display: true,
              text: "Data"
            }
          }
        }
      }
    });
  }

  // Função auxiliar para gerar cores aleatórias
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Função para atualizar o gráfico com base no número de barras selecionado
  function updateNumBarras() {
    const exercicioSelect = document.getElementById("exercicioSelect");
    const exercicioSelecionado = exercicioSelect.value;

    const numBarrasSelect = document.getElementById("numBarrasSelect");
    const numBarras = parseInt(numBarrasSelect.value);

    // Carregar o JSON e criar o gráfico com base no exercício e número de barras selecionados
    loadJSON(function(response) {
      createChart(response, exercicioSelecionado, numBarras);
    });
  }

  // Função para atualizar o gráfico quando o exercício selecionado é alterado
  function updateChart() {
    const exercicioSelect = document.getElementById("exercicioSelect");
    const exercicioSelecionado = exercicioSelect.value;

    const numBarrasSelect = document.getElementById("numBarrasSelect");
    const numBarras = parseInt(numBarrasSelect.value);

    // Carregar o JSON e criar o gráfico com base no exercício e número de barras selecionados
    loadJSON(function(response) {
      createChart(response, exercicioSelecionado, numBarras);
    });
  }

  // Carregar o JSON e criar o gráfico inicial com base nos exercícios disponíveis
  loadJSON(function(response) {
    const exercicioSelect = document.getElementById("exercicioSelect");
    const data = JSON.parse(response);
    const exercicios = data.historico_cargas;

    // Preencher o seletor com as opções de exercício
    exercicios.forEach(function(exercicio) {
      const option = document.createElement("option");
      option.value = exercicio.nome;
      option.text = exercicio.nome;
      exercicioSelect.appendChild(option);
    });

    // Selecionar o primeiro exercício por padrão
    const exercicioSelecionado = exercicioSelect.value;
    createChart(response, exercicioSelecionado, 3);

    // Adicionar os eventos onchange aos elementos
    exercicioSelect.addEventListener("change", updateChart);
    numBarrasSelect.addEventListener("change", updateNumBarras);
  });






  //servidorquedevemandar
// Função para preencher as opções de datas no campo de seleção "data"
function populateDateOptions() {
    var selectField = document.getElementById('data');

    // Obtém a data atual
    var currentDate = new Date();

    // Define a data atual como padrão
    var defaultOption = document.createElement('option');
    defaultOption.text = formatDate(currentDate);
    defaultOption.value = formatDate(currentDate);
    selectField.appendChild(defaultOption);

    // Preenche as datas anteriores
    for (var i = 1; i <= 1000; i++) {
        var previousDate = new Date();
        previousDate.setDate(currentDate.getDate() - i);

        var option = document.createElement('option');
        option.text = formatDate(previousDate);
        option.value = formatDate(previousDate);
        selectField.appendChild(option);
    }
}

// Função para preencher as opções de 1 a 1000 nos campos de seleção restantes
function popularCamposSelect(idCampo) {
var campoSelect = document.getElementById(idCampo);

for (var i = 1; i <= 1000; i++) {
  var option = document.createElement("option");
  option.value = i;
  option.text = i;
  campoSelect.appendChild(option);
}
}


// Função para preencher as opções de exercícios no campo de seleção "exercicio"
function populateExerciseOptions() {
var selectField = document.getElementById('exercicio');

// Faz a leitura do arquivo JSON
fetch('servidorquedevemandar/treino.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    // Obtém a lista de exercícios do arquivo JSON
    var exercicios = data.exercicios;

    // Preenche as opções de exercícios no campo de seleção
    exercicios.forEach(function(exercicio) {
      var option = document.createElement('option');
      option.text = exercicio;
      option.value = exercicio;
      selectField.appendChild(option);
    });
  })
  .catch(function(error) {
    console.log('Erro ao ler o arquivo JSON:', error);
  });
}

// Função para formatar a data no formato "DD/MM/YYYY"
function formatDate(date) {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
}

//popular treinos
function popularSelectComTreinos(json) {
var selectElement = document.getElementById("treino");
selectElement.innerHTML = "";

for (var i = 0; i < json.treinos.length; i++) {
  var treino = json.treinos[i];

  var optionElement = document.createElement("option");
  optionElement.value = treino.nome;
  optionElement.text = treino.nome;

  selectElement.appendChild(optionElement);
}

var cadastrarOption = document.createElement("option");
cadastrarOption.value = "cadastrar";
cadastrarOption.text = "Cadastrar novo treino";
cadastrarOption.setAttribute("data-url", "cadastrartreino.html");

selectElement.appendChild(cadastrarOption);

selectElement.addEventListener("change", function () {
  var selectedOption = selectElement.options[selectElement.selectedIndex];
  var url = selectedOption.getAttribute("data-url");

  if (url) {
    window.location.href = url;
  }
});
}

fetch("servidorquedevemandar/listatreinos.json")
.then(function (response) {
  return response.json();
})
.then(function (json) {
  popularSelectComTreinos(json);
})
.catch(function (error) {
  console.log("Erro ao ler o arquivo JSON:", error);
});


// Chama as funções para preencher as opções nos campos de seleção
populateDateOptions();
populateExerciseOptions();
popularCamposSelect("carga");
popularCamposSelect("repeticoes");




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
    /*
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></li>';
    completedButton.classList.add("complete-btn");
    setDiv.appendChild(completedButton);
    */
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