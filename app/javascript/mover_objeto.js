document.addEventListener('DOMContentLoaded', function() {
    var objeto = document.getElementById('objeto');
    var emMovimento = true; // Variável para controlar o movimento do objeto
    var raioObjeto = 15; // Raio do objeto principal
    var velocidadeX = 0.9; // Velocidade de movimento horizontal
    var velocidadeY = 0.9; // Velocidade de movimento vertical
    var larguraTela = window.innerWidth - 90;
    var alturaTela = window.innerHeight - 95;
    var gifUrls = [
        "https://media.giphy.com/media/hof5uMY0nBwxyjY9S2/giphy.gif",
        "https://media.giphy.com/media/QWvra259h4LCvdJnxP/giphy.gif",
        "https://media.giphy.com/media/USUIWSteF8DJoc5Snd/giphy.gif",
        "https://media.giphy.com/media/kfS15Gnvf9UhkwafJn/giphy.gif",
        "https://media.giphy.com/media/j5E5qvtLDTfmHbT84Y/giphy.gif",
    ];
    var asteroidGif = "https://media.giphy.com/media/Lw4N0SrJGCt5aAnHpG/giphy.gif"; // Gif do asteroide
    var objetoAdicionalGif = "https://media.giphy.com/media/LOnt6uqjD9OexmQJRB/giphy.gif"; // Gif do objeto adicional
    var numGifs = gifUrls.length;
    var gifIndex = 0;
    var gifInicial = gifUrls[0];
    var tempoPausa = 2000; // Tempo de pausa em milissegundos
    var colisoesAsteroides = 0; // Variável para armazenar o número de colisões com asteroides
    var colisoesObjetoAdicional = 0; // Variável para armazenar o número de colisões com objetos adicionais
    var raioAsteroide = 15; // Raio do asteroide
    var raioObjetoAdicional = 15; // Raio do objeto adicional
    var pontuacao = 0; // Pontuação inicial

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
            // Atualiza a posição do objeto
            var novaPosX = posX + velocidadeX;
            var novaPosY = posY + velocidadeY;

            // Verifica se o objeto atingiu os limites da tela
            if (novaPosX + raioObjeto >= larguraTela || novaPosX - raioObjeto <= 0) {
                velocidadeX *= -1; // Inverte a direção ao atingir os limites horizontais
                mudarGif();
            }
            if (novaPosY + raioObjeto >= alturaTela || novaPosY - raioObjeto <= 0) {
                velocidadeY *= -1; // Inverte a direção ao atingir os limites verticais
                mudarGif();
            }

            // Verifica colisão com os asteroides
            verificarColisaoAsteroide();

            // Verifica colisão com os objetos adicionais
            verificarColisaoObjetoAdicional();

            // Atualiza a posição do objeto
            posX = novaPosX;
            posY = novaPosY;

            objeto.style.left = posX + 'px';
            objeto.style.top = posY + 'px';
        }
    }

    function mudarGif() {
        // Mudar o GIF apenas quando atingir as paredes
        gifIndex = (gifIndex + 1) % numGifs;
        objeto.style.backgroundImage = 'url(' + gifUrls[gifIndex] + ')';
    }

    function pausarPrincipal() {
        emMovimento = false;
        objeto.style.backgroundImage = 'url(https://media.giphy.com/media/LOnt6uqjD9OexmQJRB/giphy.gif)';
        setTimeout(function() {
            retomarPrincipal();
        }, tempoPausa); // Após o tempo de pausa, retoma o movimento
    }

    function retomarPrincipal() {
        emMovimento = true;
        objeto.style.backgroundImage = 'url(' + gifInicial + ')';
    }

    function verificarColisaoAsteroide() {
        var asteroides = document.getElementsByClassName('asteroide');
        for (var i = 0; i < asteroides.length; i++) {
            var asteroide = asteroides[i];
            var posAsteroideX = parseFloat(asteroide.style.left);
            var posAsteroideY = parseFloat(asteroide.style.top);

            // Coordenadas da bounding box do asteroide
            var asteroideEsquerda = posAsteroideX;
            var asteroideDireita = posAsteroideX + (2 * raioAsteroide);
            var asteroideTopo = posAsteroideY;
            var asteroideFundo = posAsteroideY + (2 * raioAsteroide);

            // Coordenadas da bounding box do objeto principal
            var objetoEsquerda = posX - raioObjeto;
            var objetoDireita = posX + raioObjeto;
            var objetoTopo = posY - raioObjeto;
            var objetoFundo = posY + raioObjeto;

            // Verifica se houve colisão
            if (
                objetoDireita >= asteroideEsquerda &&
                objetoEsquerda <= asteroideDireita &&
                objetoFundo >= asteroideTopo &&
                objetoTopo <= asteroideFundo
            ) {
                var angulo = Math.atan2(posY - posAsteroideY, posX - posAsteroideX);
                velocidadeX = Math.cos(angulo) * 0.9;
                velocidadeY = Math.sin(angulo) * 0.9;
                pausarPrincipal();
                objeto.style.backgroundImage = 'url(https://media.giphy.com/media/IzcFv6WJ4310bDeGjo/giphy.gif)';

                // Adiciona efeito piscante ao fundo do GIF
                var count = 0;
                var blinkingInterval = setInterval(function() {
                    if (count % 2 === 0) {
                        objeto.style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; // Amarelo claro com opacidade
                    } else {
                        objeto.style.backgroundColor = 'transparent'; // Transparente
                    }
                    count++;
                    if (count === 6) {
                        clearInterval(blinkingInterval); // Para o efeito após 6 ciclos de piscadas
                    }
                }, 500); // Intervalo de 500 milissegundos
                setTimeout(function() {
                    objeto.style.backgroundImage = 'url(' + gifInicial + ')';
                    objeto.style.border = 'none'; // Remove a borda amarela após o tempo de pausa
                }, tempoPausa);
                colisoesAsteroides++; // Incrementa o número de colisões com asteroides
                pontuacao -= 3; // Subtrai 3 pontos da pontuação
                atualizarPontuacao(); // Atualiza a pontuação
                break; // Sai do loop após encontrar a primeira colisão com asteroide
            }
        }
    }




    function pausarJogo() {
        emMovimento = false; // Parar o movimento do objeto principal
        objeto.removeEventListener('mouseover', handleMouseOver);
        objeto.removeEventListener('mouseout', handleMouseOut);
        objeto.removeEventListener('click', handleClick);
    }

    function retomarJogo() {
        emMovimento = true; // Retomar o movimento do objeto principal
        objeto.addEventListener('mouseover', handleMouseOver);
        objeto.addEventListener('mouseout', handleMouseOut);
        objeto.addEventListener('click', handleClick);
    }

    function verificarColisaoObjetoAdicional() {
        var objetosAdicionais = document.getElementsByClassName('objeto-adicional');
        for (var i = 0; i < objetosAdicionais.length; i++) {
            var objetoAdicional = objetosAdicionais[i];
            var posObjetoAdicionalX = parseFloat(objetoAdicional.style.left);
            var posObjetoAdicionalY = parseFloat(objetoAdicional.style.top);

            // Verifica se houve colisão com o objeto adicional
            if (
                posX + raioObjeto >= posObjetoAdicionalX - raioObjetoAdicional &&
                posX - raioObjeto <= posObjetoAdicionalX + raioObjetoAdicional &&
                posY + raioObjeto >= posObjetoAdicionalY - raioObjetoAdicional &&
                posY - raioObjeto <= posObjetoAdicionalY + raioObjetoAdicional
            ) {
                // Pausa o movimento do objeto principal
                emMovimento = false;
                objetoAdicional.style.display = 'none'; // Esconde o objeto adicional
                // Remove o objeto adicional após a pausa
                setTimeout(function() {
                    objetoAdicional.remove();
                    // Verifica se não há mais estrelas na tela
                    if (document.getElementsByClassName('objeto-adicional').length === 0) {
                        // Centraliza o objeto principal na tela
                        posX = larguraTela / 2;
                        posY = alturaTela / 2;
                        objeto.style.left = (posX - raioObjeto) + 'px'; // Centraliza horizontalmente
                        objeto.style.top = (posY - raioObjeto) + 'px'; // Centraliza verticalmente

                        // Exibe a mensagem "Missão concluída!"
                        var mensagemConcluida = document.createElement('div');
                        mensagemConcluida.textContent = "Missão concluída!";
                        mensagemConcluida.className = "mensagem-final";
                        document.body.appendChild(mensagemConcluida);
                    }
                }, tempoPausa);
                colisoesObjetoAdicional++; // Incrementa o número de colisões com objetos adicionais
                pontuacao += 15; // Adiciona 15 pontos à pontuação
                atualizarPontuacao(); // Atualiza a pontuação
                break; // Sai do loop após encontrar a primeira colisão
            }
        }
    }



    // Função para criar os objetos adicionais e os asteroides
    function criarObjetos() {
        // Loop para criar os emojis adicionais
        for (var i = 0; i < 1; i++) {
            var objetoAdicional = document.createElement('div');
            objetoAdicional.className = 'objeto-adicional'; // Classe para estilização
            document.body.appendChild(objetoAdicional);

            // Calcula a posição do emoji adicional
            var posX = Math.random() * (larguraTela - raioObjetoAdicional * 2) + raioObjetoAdicional;
            var posY = Math.random() * (alturaTela - raioObjetoAdicional * 2) + raioObjetoAdicional;

            // Aplica a posição
            objetoAdicional.style.left = posX + 'px';
            objetoAdicional.style.top = posY + 'px';
        }

        // Loop para criar os asteroides
        for (var j = 0; j < 5; j++) {
            var asteroide = document.createElement('div');
            asteroide.className = 'asteroide'; // Classe para estilização
            asteroide.style.backgroundImage = 'url(' + asteroidGif + ')';
            document.body.appendChild(asteroide);

            // Calcula a posição do asteroide
            var posX = Math.random() * (larguraTela - raioAsteroide * 2) + raioAsteroide;
            var posY = Math.random() * (alturaTela - raioAsteroide * 2) + raioAsteroide;

            // Aplica a posição
            asteroide.style.left = posX + 'px';
            asteroide.style.top = posY + 'px';
        }
    }

    function atualizarPontuacao() {
        pontuacaoElemento.textContent = "Pontos: " + pontuacao;
        pontuacaoElemento.className = 'pontuacao'; // Aplicando a classe "pontuacao"

    }

    // Criar o elemento de pontuação
    var pontuacaoElemento = document.createElement('div');
    pontuacaoElemento.textContent = "Pontuação: " + pontuacao;
    pontuacaoElemento.style.position = 'fixed';
    pontuacaoElemento.style.bottom = '10px';
    pontuacaoElemento.style.left = '10px';
    pontuacaoElemento.style.color = 'white';
    pontuacaoElemento.style.fontSize = '20px';
    document.body.appendChild(pontuacaoElemento);
    // Adiciona a classe ao elemento do score na inicialização
    pontuacaoElemento.className = 'pontuacao'
    objeto.addEventListener('mouseover', function() {
        objeto.style.border = '2px solid yellow'; // Muda a borda para amarelo
    });

    objeto.addEventListener('mouseout', function() {
        objeto.style.border = 'none'; // Remove a borda
    });

    objeto.addEventListener('click', function() {
        emMovimento = !emMovimento; // Inverte o estado de movimento
    });

    var posX = larguraTela / 2;
    var posY = alturaTela / 2;
    criarObjetos(); // Cria os objetos adicionais e os asteroides
    setInterval(atualizarPosicao, 10); // Intervalo de atualização
});
