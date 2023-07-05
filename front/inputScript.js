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

    // Chama as funções para preencher as opções nos campos de seleção
  populateDateOptions();
  populateExerciseOptions();
  popularCamposSelect("carga");
  popularCamposSelect("repeticoes");