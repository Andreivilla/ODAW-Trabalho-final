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

    // Função para atualizar o gráfico com base no número de barras inserido pelo usuário
    function updateNumBarras() {
      // Carregar o JSON e criar o gráfico com base no exercício selecionado
      loadJSON(function(response) {
        const exercicioSelect = document.getElementById("exercicioSelect");
        const exercicioSelecionado = exercicioSelect.value;

        const numBarrasInput = document.getElementById("numBarrasInput");
        const numBarras = parseInt(numBarrasInput.value);

        createChart(response, exercicioSelecionado, numBarras);
      });
    }

    // Função para atualizar o gráfico quando o exercício selecionado é alterado
    function updateChart() {
      const exercicioSelect = document.getElementById("exercicioSelect");
      const exercicioSelecionado = exercicioSelect.value;

      // Carregar o JSON e criar o gráfico com base no exercício selecionado
      loadJSON(function(response) {
        const numBarrasInput = document.getElementById("numBarrasInput");
        const numBarras = parseInt(numBarrasInput.value);

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
      numBarrasInput.addEventListener("change", updateNumBarras);
    });
