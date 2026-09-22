/* =====================================================
   ELEMENTOS
===================================================== */

const formLivro =
    document.getElementById("formLivro");

const estrelas =
    document.querySelectorAll("#estrelas span");

const livros =
    document.getElementById("livros");

const botaoAdicionar =
    document.getElementById("botaoAdicionar");

const botaoVoltar =
    document.getElementById("botaoVoltar");

const telaPrincipal =
    document.getElementById("telaPrincipal");

const telaAdicionar =
    document.getElementById("telaAdicionar");

const textoAvaliacao =
    document.getElementById("textoAvaliacao");


let avaliacao = 0;


/* =====================================================
   ABRIR TELA DE ADICIONAR
===================================================== */

botaoAdicionar.addEventListener(
    "click",
    function () {

        telaPrincipal.classList.add(
            "tela-escondida"
        );

        telaAdicionar.classList.remove(
            "tela-escondida"
        );

        window.scrollTo(0, 0);

    }
);


/* =====================================================
   VOLTAR PARA ESTANTE
===================================================== */

botaoVoltar.addEventListener(
    "click",
    function () {

        telaAdicionar.classList.add(
            "tela-escondida"
        );

        telaPrincipal.classList.remove(
            "tela-escondida"
        );

        window.scrollTo(0, 0);

    }
);


/* =====================================================
   ESTRELAS
===================================================== */

estrelas.forEach(
    function (estrela) {


        estrela.addEventListener(
            "click",
            function () {


                avaliacao =
                    Number(
                        estrela.dataset.valor
                    );


                estrelas.forEach(
                    function (item) {

                        const valor =
                            Number(
                                item.dataset.valor
                            );


                        if (
                            valor <= avaliacao
                        ) {

                            item.classList.add(
                                "ativa"
                            );

                        } else {

                            item.classList.remove(
                                "ativa"
                            );

                        }

                    }
                );


                textoAvaliacao.textContent =
                    avaliacao +
                    (
                        avaliacao === 1
                            ? " estrela"
                            : " estrelas"
                    );

            }
        );

    }
);


/* =====================================================
   FORMULÁRIO
===================================================== */

formLivro.addEventListener(
    "submit",
    async function (evento) {


        evento.preventDefault();


        /* ---------------------------------------------
           DADOS
        --------------------------------------------- */

        const nome =
            document
                .getElementById("nome")
                .value
                .trim();


        const autor =
            document
                .getElementById("autor")
                .value
                .trim();


        const genero =
            document
                .getElementById("genero")
                .value
                .trim();


        const opiniao =
            document
                .getElementById("opiniao")
                .value
                .trim();


        const inicio =
            document
                .getElementById("inicio")
                .value;


        const fim =
            document
                .getElementById("fim")
                .value;


        const arquivoCapa =
            document
                .getElementById("capa")
                .files[0];


        /* ---------------------------------------------
           VERIFICAR ESTRELAS
        --------------------------------------------- */

        if (avaliacao === 0) {

            alert(
                "Escolha uma avaliação de 1 a 5 estrelas."
            );

            return;

        }


        try {


            /* -----------------------------------------
               CAPA
            ----------------------------------------- */

            let capa = "";


            if (arquivoCapa) {

                capa =
                    await comprimirImagem(
                        arquivoCapa
                    );

            }


            /* -----------------------------------------
               LIVRO
            ----------------------------------------- */

            const novoLivro = {

                id: Date.now(),

                nome: nome,

                autor: autor,

                genero: genero,

                opiniao: opiniao,

                inicio: inicio,

                fim: fim,

                capa: capa,

                avaliacao: avaliacao

            };


            /* -----------------------------------------
               LIVROS EXISTENTES
            ----------------------------------------- */

            let listaLivros =
                JSON.parse(
                    localStorage.getItem(
                        "meusLivros"
                    )
                ) || [];


            /* -----------------------------------------
               ADICIONAR
            ----------------------------------------- */

            listaLivros.push(
                novoLivro
            );


            /* -----------------------------------------
               SALVAR
            ----------------------------------------- */

            localStorage.setItem(
                "meusLivros",
                JSON.stringify(
                    listaLivros
                )
            );


            /* -----------------------------------------
               ATUALIZAR
            ----------------------------------------- */

            mostrarLivros();


            /* -----------------------------------------
               LIMPAR
            ----------------------------------------- */

            formLivro.reset();


            avaliacao = 0;


            estrelas.forEach(
                function (estrela) {

                    estrela.classList.remove(
                        "ativa"
                    );

                }
            );


            textoAvaliacao.textContent =
                "Escolha uma avaliação";


            /* -----------------------------------------
               VOLTAR
            ----------------------------------------- */

            telaAdicionar.classList.add(
                "tela-escondida"
            );


            telaPrincipal.classList.remove(
                "tela-escondida"
            );


            window.scrollTo(
                0,
                0
            );


        } catch (erro) {


            console.error(
                "Erro ao salvar livro:",
                erro
            );


            alert(
                "Não foi possível salvar o livro. " +
                "Tente escolher uma imagem menor."
            );

        }

    }
);


/* =====================================================
   COMPRIMIR IMAGEM
===================================================== */

function comprimirImagem(arquivo) {


    return new Promise(
        function (resolve, reject) {


            const leitor =
                new FileReader();


            leitor.onload =
                function (evento) {


                    const imagem =
                        new Image();


                    imagem.onload =
                        function () {


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            const tamanhoMaximo =
                                500;


                            let largura =
                                imagem.width;


                            let altura =
                                imagem.height;


                            /* ---------------------------------
                               REDIMENSIONAR
                            --------------------------------- */

                            if (
                                largura >
                                tamanhoMaximo
                            ) {


                                altura =
                                    altura *
                                    (
                                        tamanhoMaximo /
                                        largura
                                    );


                                largura =
                                    tamanhoMaximo;

                            }


                            if (
                                altura >
                                tamanhoMaximo
                            ) {


                                largura =
                                    largura *
                                    (
                                        tamanhoMaximo /
                                        altura
                                    );


                                altura =
                                    tamanhoMaximo;

                            }


                            canvas.width =
                                largura;


                            canvas.height =
                                altura;


                            const contexto =
                                canvas.getContext(
                                    "2d"
                                );


                            contexto.drawImage(
                                imagem,
                                0,
                                0,
                                largura,
                                altura
                            );


                            const imagemFinal =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.7
                                );


                            resolve(
                                imagemFinal
                            );

                        };


                    imagem.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Erro ao carregar imagem."
                                )
                            );

                        };


                    imagem.src =
                        evento.target.result;

                };


            leitor.onerror =
                function () {

                    reject(
                        new Error(
                            "Erro ao ler imagem."
                        )
                    );

                };


            leitor.readAsDataURL(
                arquivo
            );

        }
    );

}


/* =====================================================
   MOSTRAR LIVROS
===================================================== */

function mostrarLivros() {


    livros.innerHTML = "";


    const listaLivros =
        JSON.parse(
            localStorage.getItem(
                "meusLivros"
            )
        ) || [];


    /* ---------------------------------------------
       ESTANTE VAZIA
    --------------------------------------------- */

    if (
        listaLivros.length === 0
    ) {


        livros.innerHTML = `

            <div class="sem-livros">

                <p>📖</p>

                <p>
                    Sua estante ainda está vazia.
                    <br>
                    Adicione sua primeira leitura!
                </p>

            </div>

        `;


        return;

    }


    /* ---------------------------------------------
       MOSTRAR LIVROS
    --------------------------------------------- */

    listaLivros.forEach(
        function (livro) {

            criarCardLivro(
                livro
            );

        }
    );

}


/* =====================================================
   CRIAR CARD
===================================================== */

function criarCardLivro(livro) {


    const card =
        document.createElement(
            "article"
        );


    card.classList.add(
        "livro"
    );


    /* ---------------------------------------------
       ESTRELAS
    --------------------------------------------- */

    let estrelasHTML = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {


        if (
            i <= livro.avaliacao
        ) {

            estrelasHTML += "★";

        } else {

            estrelasHTML += "☆";

        }

    }


    /* ---------------------------------------------
       CAPA
    --------------------------------------------- */

    let capaHTML = "";


    if (
        livro.capa
    ) {


        capaHTML = `

            <img
                src="${livro.capa}"
                alt="Capa de ${escaparHTML(livro.nome)}"
            >

        `;

    } else {


        capaHTML = `

            <div class="sem-capa">

                📖

            </div>

        `;

    }


    /* ---------------------------------------------
       DATAS
    --------------------------------------------- */

    let datasHTML = "";


    if (
        livro.inicio
    ) {


        datasHTML =
            "Início: " +
            formatarData(
                livro.inicio
            );

    }


    if (
        livro.fim
    ) {


        if (
            datasHTML !== ""
        ) {

            datasHTML += " | ";

        }


        datasHTML +=
            "Fim: " +
            formatarData(
                livro.fim
            );

    }


    /* ---------------------------------------------
       CARD
    --------------------------------------------- */

    card.innerHTML = `

        ${capaHTML}

        <div class="informacoes">

            <h3>
                ${escaparHTML(
                    livro.nome
                )}
            </h3>

            <p class="autor">
                ${escaparHTML(
                    livro.autor
                )}
            </p>

            <p class="genero">
                ${escaparHTML(
                    livro.genero
                )}
            </p>

            <div class="avaliacao">

                ${estrelasHTML}

            </div>

            <p class="opiniao">

                ${escaparHTML(
                    livro.opiniao
                )}

            </p>

            <p class="datas-leitura">

                ${datasHTML}

            </p>


            <button
                class="botao-excluir"
                data-id="${livro.id}"
            >

                Excluir livro

            </button>

        </div>

    `;


    /* ---------------------------------------------
       EXCLUIR
    --------------------------------------------- */

    const botaoExcluir =
        card.querySelector(
            ".botao-excluir"
        );


    botaoExcluir.addEventListener(
        "click",
        function () {

            excluirLivro(
                livro.id
            );

        }
    );


    livros.appendChild(
        card
    );

}


/* =====================================================
   EXCLUIR LIVRO
===================================================== */

function excluirLivro(id) {


    const confirmar =
        confirm(
            "Deseja realmente excluir este livro?"
        );


    if (
        !confirmar
    ) {

        return;

    }


    let listaLivros =
        JSON.parse(
            localStorage.getItem(
                "meusLivros"
            )
        ) || [];


    listaLivros =
        listaLivros.filter(
            function (livro) {

                return (
                    livro.id !== id
                );

            }
        );


    localStorage.setItem(
        "meusLivros",
        JSON.stringify(
            listaLivros
        )
    );


    mostrarLivros();

}


/* =====================================================
   FORMATAR DATA
===================================================== */

function formatarData(data) {


    if (
        !data
    ) {

        return "";

    }


    const partes =
        data.split("-");


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* =====================================================
   PROTEGER TEXTO
===================================================== */

function escaparHTML(texto) {


    if (
        !texto
    ) {

        return "";

    }


    return texto

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   CARREGAR AO ABRIR
===================================================== */

mostrarLivros();