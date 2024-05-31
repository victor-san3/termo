const apiEndpoint = 'http://137.184.66.198/termo_api.php';

var height = 6; //número de tentativas
var width = 5; //comprimento da palavra

var row = 0; //tentativa atual
var col = 0; //letra atual

var gameOver = false;
var gameOver1 = false;
var gameOver2 = false;


var word1; // Atribuir palavra baseada na resposta da API...
var word2; // Atribuir palavra baseada na resposta da API...
var word1SemAcento = removerAcentos(word1);
var word2SemAcento = removerAcentos(word2);


if(word1 == word2)
{
    word2 = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
}

var wordListSemAcento = wordList.map(removerAcentos);

console.log(word1);
console.log(word2);
console.log(word1SemAcento);
console.log(word2SemAcento);

window.onload = function()
{
    start();
}

function start()
{
    //Criar o jogo 1
    for(let r = 0; r < height; r++) //verificacao de tentativas
    {
        for(let c = 0; c < width; c++) //elementos na horizontal
        {
            let tile = document.createElement("span");
            tile.id = "jogo1-" + r.toString() + '-' + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("jogo1").appendChild(tile);
        }
    }

    //Criar o jogo 2
    for(let r = 0; r < height; r++)
    {
        for(let c = 0; c < width; c++)
        {
            let tile = document.createElement("span");
            tile.id = "jogo2-" + r.toString() + '-' + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("jogo2").appendChild(tile);
        }
    }

    //Criar teclado

    let keyboard = [

		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

		["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],

		["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]

    ];
    
    for (let i = 0; i < keyboard.length; i++){
        let currRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");
        
        for (let j = 0; j < currRow.length; j++){
            let keyTile = document.createElement("div");

            let key = currRow[j];
            keyTile.innerHTML = key;

            if (key == "Enter") 
            {
                keyTile.id = "Enter";
            }
            else if (key == "⌫")
            {
                keyTile.id = "Backspace";
            }
            else if ("A" <= key && key <= "Z")
            {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);
            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            }
            else
            {
                keyTile.classList.add("key-tile");
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow);
    }

    //Receber a letra
    {
        document.addEventListener("keyup", (e) => {
            processInput(e);
        })
    }
}

function processKey()
{
    let e = {"code" : this.id};
    processInput(e);
}

function processInput(e) 
{
    if(gameOver == true) return;

    //alert(e.code);
    if("KeyA" <= e.code && e.code <= "KeyZ") //verificar se sao letras
    {
        if(col < width)
        {
            //letra do jogo1
            if(!gameOver1)
            {
                let currTile = document.getElementById("jogo1-" + row.toString() + '-' + col.toString());
                if(currTile.innerText == "")
                {
                    currTile.innerText = e.code[3];
                }
            }
            
            //letra do jogo2
            if(!gameOver2){
                let currTile = document.getElementById("jogo2-" + row.toString() + '-' + col.toString());
                if(currTile.innerText == "")
                {
                    currTile.innerText = e.code[3];
                }
            }

            col += 1;
        }
    }
    else if(e.code == "Backspace") //permite corrigir a letra
    {
        if(0 < col && col <= width)
        {
            col -= 1;
            if(!gameOver1) 
            {
                let currTile = document.getElementById("jogo1-" + row.toString() + '-' + col.toString());
                currTile.innerText = "";
            }

            if(!gameOver2) 
            {
                let currTile = document.getElementById("jogo2-" + row.toString() + '-' + col.toString());
                currTile.innerText = "";
            }
        }
    }
    else if(e.code == "Enter") //verifica se a palavra existe, se as letrase estão na posicao certa e passa para baixo
    {
        update();
    }

    if(gameOver == false && row == height)
    {
        gameOver = true;
        document.getElementById("resposta").innerText = word;
    }
}

function removerAcentos(str)
{
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function update()
{
    let tentativa1 = "";
    let tentativa2 = "";
    document.getElementById("resposta").innerText = "";

    //receber a palavra da tentativa
    for(let c = 0; c < width; c++)
    {
        let currTile = document.getElementById("jogo1-" + row.toString() + '-' + c.toString());
        let letter = currTile.innerText;
        tentativa1 += letter;

        currTile = document.getElementById("jogo2-" + row.toString() + '-' + c.toString());
        letter = currTile.innerText;
        tentativa2 += letter;
    }
    tentativa1 = tentativa1.toLowerCase();
    tentativa2 = tentativa2.toLowerCase();
    if(!gameOver1 && !wordListSemAcento.includes(tentativa1))
    {
        document.getElementById("resposta").innerText = "Palavra não aceita."; //verifica se a palavra existe
        return;
    }
    if(!gameOver2 && !wordListSemAcento.includes(tentativa2))
    {
        document.getElementById("resposta").innerText = "Palavra não aceita."; //verifica se a palavra existe
        return;
    }


    let correto1 = 0;
    let correto2 = 0;
    let letterCount1 = {};
    let letterCount2 = {};
    for(let i = 0; i < word1.length; i++)
    {
        letter1 = word1[i];
        if(letterCount1[letter1])
        {
            letterCount1[letter1] += 1;
        }
        else
        {
            letterCount1[letter1] = 1;
        }

        letter2 = word2[i];
        if(letterCount2[letter2])
        {
            letterCount2[letter2] += 1;
        }
        else
        {
            letterCount2[letter2] = 1;
        }
    }

    //verificar letras na palavras
    for(let c = 0; c < width; c++)
    {
        let currTile1 = document.getElementById("jogo1-" + row.toString() + '-' + c.toString());
        let letter1 = currTile1.innerText;
        let currTile2 = document.getElementById("jogo2-" + row.toString() + '-' + c.toString());
        let letter2 = currTile2.innerText;

        //se estiver na posição correta
        if(!gameOver1)
        {
            if(word1SemAcento[c] == letter1)
            {
                currTile1.classList.add("correto");
                let keyTile = document.getElementById("Key" + letter1);
                keyTile.classList.add("correto");
                correto1 += 1;
                letterCount1[letter1] -= 1;
            }

            if(correto1 == width)
            {
                gameOver1 = true;
            }
        }

        if(!gameOver2)
        {
            if(word2SemAcento[c] == letter2)
            {
                currTile2.classList.add("correto");
                correto2 += 1;
                letterCount2[letter2] -= 1;
            }

            if(correto2 == width)
            {
                gameOver2 = true;
            }
        }

        if(gameOver1 && gameOver2)
        {
            gameOver = true;
        }

    }

    //verificar se as letras estão em outra posição ou não estão na palavra
    for(let c = 0; c < width; c++)
    {
        let currTile1 = document.getElementById("jogo1-" + row.toString() + '-' + c.toString());
        let letter1 = currTile1.innerText;
        let currTile2 = document.getElementById("jogo2-" + row.toString() + '-' + c.toString());
        let letter2 = currTile2.innerText;

        if(!gameOver1 && !currTile1.classList.contains("correto"))
        {
            if(word1SemAcento.includes(letter1) && letterCount1[letter1] > 0)
            {
                currTile1.classList.add("contem");
                let keyTile = document.getElementById("Key" + letter1);

                if (!keyTile.classList.contains("correto")) {
                    keyTile.classList.add("contem");
                }

                letterCount1[letter1] -= 1;
            }
            //se não tem a letra na palavra
            else
            {
                currTile1.classList.add("errado");
            }
        }

        if(!gameOver2 && !currTile2.classList.contains("correto"))
        {
            if(word2SemAcento.includes(letter2) && letterCount2[letter2] > 0)
            {
                currTile2.classList.add("contem");
                letterCount2[letter2] -= 1;
            }
            //se não tem a letra na palavra
            else
            {
                currTile2.classList.add("errado");
            }
        }
    }
    row += 1;
    col = 0;
}
