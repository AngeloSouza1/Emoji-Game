document.addEventListener('DOMContentLoaded', function() {
    var objeto = document.getElementById('objeto');
    var emMovimento = true; // Variável para controlar o movimento do objeto

    var larguraTela = window.innerWidth - 90;
    var alturaTela = window.innerHeight - 95;
    var raio = 2;
    var posX = larguraTela / 2;
    var posY = raio; // Começa do topo da tela
    var velocidadeX = 1;
    var velocidadeY = 1;
    var gifUrls = [
        "https://media.giphy.com/media/hof5uMY0nBwxyjY9S2/giphy.gif",
        "https://media.giphy.com/media/QWvra259h4LCvdJnxP/giphy.gif",
        "https://media.giphy.com/media/USUIWSteF8DJoc5Snd/giphy.gif",
        "https://media.giphy.com/media/kfS15Gnvf9UhkwafJn/giphy.gif",
        "https://media.giphy.com/media/j5E5qvtLDTfmHbT84Y/giphy.gif",
    ];
    var numGifs = gifUrls.length;
    var gifIndex = 0;

    // Pré-carregar imagens
    var imagens = [];
    gifUrls.forEach(function(url) {
        var img = new Image();
        img.src = url;
        imagens.push(img);
    });

    objeto.style.backgroundImage = 'url(' + gifUrls[gifIndex] + ')';

    function atualizarPosicao() {
        if (emMovimento) {
            posX += velocidadeX;
            posY += velocidadeY;

            if (posX + raio >= larguraTela || posX - raio <= 0) {
                velocidadeX = -velocidadeX;
                mudarGif();
            }
            if (posY + raio >= alturaTela || posY - raio <= 0) {
                velocidadeY = -velocidadeY;
                mudarGif();
            }

            objeto.style.left = posX + 'px';
            objeto.style.top = posY + 'px';
        }
    }

    function mudarGif() {
        gifIndex = (gifIndex + 1) % numGifs;
        objeto.style.backgroundImage = 'url(' + gifUrls[gifIndex] + ')';
    }

    // Quando o mouse entra no objeto
    objeto.addEventListener('mouseover', function() {
        destacar(true); // Começa o destaque
    });

    // Quando o mouse sai do objeto
    objeto.addEventListener('mouseout', function() {
        destacar(false); // Para o destaque
    });

    // Função para destacar o objeto
    function destacar(destacado) {
        if (destacado) {
            objeto.style.border = '2px solid yellow'; // Muda a borda para amarelo
        } else {
            objeto.style.border = 'none'; // Remove a borda
        }
    }

    // Quando o objeto é clicado
    objeto.addEventListener('click', function() {
        emMovimento = !emMovimento; // Inverte o estado de movimento
    });

    // Criar emojis adicionais
    criarObjetos();

    function criarObjetos() {
        var numObjetos = 5; // Número de emojis adicionais

        for (var i = 0; i < numObjetos; i++) {
            var objetoAdicional = document.createElement('div');
            objetoAdicional.className = 'objeto-adicional'; // Classe para estilização
            document.body.appendChild(objetoAdicional);

            // Definir posição aleatória
            var posX = Math.random() * larguraTela;
            var posY = Math.random() * alturaTela;

            // Aplicar posição
            objetoAdicional.style.left = posX + 'px';
            objetoAdicional.style.top = posY + 'px';
        }
    }

    // Função para atualizar a posição do objeto principal
    setInterval(atualizarPosicao, 5); // Ajuste o intervalo conforme necessário
});
