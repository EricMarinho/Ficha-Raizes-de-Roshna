interface IMinMax {
    min: number
    max: number
}

interface IHabilidades {
    nome: string
    modificador: number
    alocado: number
    valor: number
}

interface ICombate {
    nome: string
    dados: string
    range: string
}

const savingThrow = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma"]
const atributos = ["Força", "Destreza", "Constituição", "Inteligência", "Sabedoria", "Carisma", "Iniciativa", "Acerto"]
const proficiencias = ["Acrobacia", "Arcanismo", "Atletismo", "Enganação", "Futividade", "História", "Intimidação", "Intuição", "Investigação", "Lidar com animais", "Manejo", "Medicina", "Natureza", "Percepção", "Performance", "Persuasão", "Religião", "Sobrevivência"]
const ataque = [""]
const nivel = ["Cantrip", "1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º"]

class Ficha {
    private id: string
    private db: any
    private dados: {
        nomeJogador: string
        nomePersonagem: string
        idade: string
        profissao: string
        genero: string
        origem: string
    }
    private vida: IMinMax & {
        temporaria: number
    }
    private stamina: IMinMax
    private parasita: IMinMax
    private normal: boolean
    private ferido: boolean
    private morrendo: boolean
    private morto: boolean
    private condicao: string
    private armorClass: string
    private movimento: string
    private spellsSlots: string
    private profBonus: string
    private hitDiceValue: string
    private hitDiceQuantity: string
    private petSelecionado: string | null
    private spellsSlotsArray: Array<{
        nivel: string
        quantidade: string
        magias: Array<{
            nome: string
            range: string
            nivel: string
            castingTime: string
            duracao: string
        }>
    }>
    private atributos: Array<{
        nome: string
        valor: string
    }>
    private combate: Array<ICombate>
    private genericRoll: Array<{
        nome: string
        dados: string
    }>
    private habilidades: {
        savingThrow: Array<IHabilidades>
        ataque: Array<IHabilidades>
        proficiencias: Array<IHabilidades>
    }
    private pets: Array<{
        nome: string
        vida: string
        ac: string
        proficienciaBonus: number
        savingThrow: Array<IHabilidades>
        ataque: Array<IHabilidades>
        proficiencias: Array<IHabilidades>
        combate: Array<ICombate>
    }>
    private inventario: Array<{
        nome: string
        peso: string
    }>
    private notas: string

    constructor(id: string, db: any) {
        this.id = id
        this.db = db
        this.dados = localStorage.getItem(`${id}_dados`) ? JSON.parse(localStorage.getItem(`${id}_dados`) as string) : {
            nomeJogador: '',
            nomePersonagem: '',
            idade: '',
            profissao: '',
            genero: '',
            origem: ''
        }
        this.vida = localStorage.getItem(`${id}_vida`) ? JSON.parse(localStorage.getItem(`${id}_vida`) as string) : {
            min: 0,
            max: 0,
            temporaria: 0
        }

        this.normal = localStorage.getItem(`${id}_normal`) ? JSON.parse(localStorage.getItem(`${id}_normal`) as string) : false
        this.ferido = localStorage.getItem(`${id}_ferido`) ? JSON.parse(localStorage.getItem(`${id}_ferido`) as string) : false
        this.morrendo = localStorage.getItem(`${id}_morrendo`) ? JSON.parse(localStorage.getItem(`${id}_morrendo`) as string) : false
        this.morto = localStorage.getItem(`${id}_morto`) ? JSON.parse(localStorage.getItem(`${id}_morto`) as string) : false
        this.condicao = localStorage.getItem(`${id}_condicao`) ? JSON.parse(localStorage.getItem(`${id}_condicao`) as string) : ''
        this.armorClass = localStorage.getItem(`${id}_armorClass`) ? JSON.parse(localStorage.getItem(`${id}_armorClass`) as string) : '0'
        this.movimento = localStorage.getItem(`${id}_movimento`) ? JSON.parse(localStorage.getItem(`${id}_movimento`) as string) : '0'
        this.spellsSlots = localStorage.getItem(`${id}_spellsSlots`) ? JSON.parse(localStorage.getItem(`${id}_spellsSlots`) as string) : '0'
        this.profBonus = localStorage.getItem(`${id}_profBonus`) ? JSON.parse(localStorage.getItem(`${id}_profBonus`) as string) : '0'
        this.hitDiceValue = localStorage.getItem(`${id}_hitDiceValue`) ? JSON.parse(localStorage.getItem(`${id}_hitDiceValue`) as string) : '0'
        this.hitDiceQuantity = localStorage.getItem(`${id}_hitDiceQuantity`) ? JSON.parse(localStorage.getItem(`${id}_hitDiceQuantity`) as string) : '0'
        this.atributos = localStorage.getItem(`${id}_atributos`) ? JSON.parse(localStorage.getItem(`${id}_atributos`) as string) : atributos.map(x => ({ nome: x, valor: 0 }))
        this.combate = localStorage.getItem(`${id}_combate`) ? JSON.parse(localStorage.getItem(`${id}_combate`) as string) : []
        this.spellsSlotsArray = localStorage.getItem(`${id}_spellsSlotsArray`) ? JSON.parse(localStorage.getItem(`${id}_spellsSlotsArray`) as string) : nivel.map((x,index) => ({
                nivel: x, 
                quantidade: '0',
                magias: []
        }))
        this.genericRoll = localStorage.getItem(`${id}_genericRoll`) ? JSON.parse(localStorage.getItem(`${id}_genericRoll`) as string) : []
        this.habilidades = localStorage.getItem(`${id}_habilidades`) ? JSON.parse(localStorage.getItem(`${id}_habilidades`) as string) : {
            proficiencias: proficiencias.map(x => ({ nome: x, modificador: 0, alocado: 0, valor: 0 })),
            savingThrow: savingThrow.map(x => ({ nome: x, modificador: 0, alocado: 0, valor: 0 })),
            ataque: ataque.map(x => ({ nome: x, modificador: 0, alocado: 0, valor: 0 }))
        }
        this.pets = localStorage.getItem(`${id}_pets`) ? JSON.parse(localStorage.getItem(`${id}_pets`) as string) : []
        this.inventario = localStorage.getItem(`${id}_inventario`) ? JSON.parse(localStorage.getItem(`${id}_inventario`) as string) : []
        this.notas = localStorage.getItem(`${id}_notas`) ? JSON.parse(localStorage.getItem(`${id}_notas`) as string) : ''
        this.petSelecionado = localStorage.getItem(`${id}_petSelecionado`) ? JSON.parse(localStorage.getItem(`${id}_petSelecionado`) as string) : null
        if (this.pets[0]) {
            this.petSelecionado = this.pets[0].nome
        }
        this.imprimirFicha()
    }

    private imprimirAtributos() {
        const elementoPai = document.querySelector('#atributos')
        let newHTML = ''
        this.atributos.forEach((x, index) => {
            newHTML += `<div class="d-flex flex-column align-items-center classeFlexDois">
                        <img src="DadoCinza.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="ficha.gerarDado(ficha.atributos[${index}],'normal', 1, '${x.nome}', null)">
                        <div><img src="DadosDesvantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="ficha.gerarDado(ficha.atributos[${index}],'desvantagem', 2, '${x.nome}', null)">
                        <img src="DadosVantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="ficha.gerarDado(ficha.atributos[${index}],'vantagem', 2, '${x.nome}', null)">
                        </div><span class="d-block">${x.nome}</span>
                        <input class="fundoPreto" id="atributos${index}" onkeyup="ficha.salvarLocalStorage(event,'valor',${index},'atributos')">
            </div>`
        })
        elementoPai.innerHTML = newHTML
        this.atributos.forEach((x, index) => {
            const atributoInput: any = document.querySelector(`#atributos${index}`)
            atributoInput.value = x.valor
        })
    }

    private imprimirCombate() {
        const elementoPai = document.querySelector("#combate")
        let newHTML = `<thead class="fontesLegais">
                <td></td>
                <td width="50%">Nome</td>
                <td width="35%">Dano</td>
               <td width="10%">Rng</td>
               <td width="5%"> </td>
                </thead>`
        this.combate.forEach((x, index) => {
            newHTML += ` <tr>
                        <td> <img src="Dado.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="ficha.gerarDadoCombate(${index})"> </td>
                        <td><input class="fundoPretoDois fontesLegais fonteBonita" id="nomeCombate-${index}" onkeyup="ficha.salvarLocalStorage(event, 'nome', ${index},'combate')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="dadosCombate-${index}" onkeyup="ficha.salvarLocalStorage(event, 'dados', ${index},'combate')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="rangeCombate-${index}" onkeyup="ficha.salvarLocalStorage(event, 'range', ${index},'combate')"></td>
                        <td><button class="bg-dark" onclick="ficha.apagarElementoArray(${index},'combate')">X</button></td>
                        </tr> `
        })
        elementoPai.innerHTML = newHTML
        this.combate.forEach((x, index) => {
            const nomeInput: any = document.querySelector(`#nomeCombate-${index}`)
            nomeInput.value = x.nome || ''
            const dadosInput: any = document.querySelector(`#dadosCombate-${index}`)
            dadosInput.value = x.dados || ''
            const rangeInput: any = document.querySelector(`#rangeCombate-${index}`)
            rangeInput.value = x.range || ''
        })
    }

    private imprimirGenericRoll() {
        const elementoPai = document.querySelector("#genericRoll")
        let newHTML = `<thead class="fontesLegais">
                <td></td>
                <td width="60%">Nome</td>
                <td width="35%">Dados</td>
               <td width="5%"> </td>
                </thead>`
        this.genericRoll.forEach((x, index) => {
            newHTML += ` <tr>
                        <td> <img src="Dado.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="ficha.gerarDadoCombate(${index},'genericRoll')"></td>
                        <td><input class="fundoPretoDois fontesLegais fonteBonita" id="nomegenericRoll-${index}" onkeyup="ficha.salvarLocalStorage(event, 'nome', ${index},'genericRoll')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="dadosgenericRoll-${index}" onkeyup="ficha.salvarLocalStorage(event, 'dados', ${index},'genericRoll')"></td>
                        <td><button class="bg-dark" onclick="ficha.apagarElementoArray(${index},'genericRoll')">X</button></td>
                        </tr> `
        })
        elementoPai.innerHTML = newHTML
        this.genericRoll.forEach((x, index) => {
            const nomeInput: any = document.querySelector(`#nomegenericRoll-${index}`)
            nomeInput.value = x.nome || ''
            const dadosInput: any = document.querySelector(`#dadosgenericRoll-${index}`)
            dadosInput.value = x.dados || ''
        })
    }

    private imprimirProficiencias(seletorTabela: string, item: any, idName: string, nomePet: string = null) {
        const elementoPai = document.querySelector(`.container${seletorTabela}`)
        let newHTML = `<table>
                <tr><td colspan="7">Saving Throws</td></tr>`
        function Template(x, index, property: string) {
            newHTML += /* html */ ` <tr>
                <td><div><img src="DadosDesvantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}${property}buttonDesvantagemContainer-${index}"> </td>
                <td> <img src="DadoCinza.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}${property}buttonContainer-${index}"> </td>
                <td> <img src="DadosVantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}${property}buttonVantagemContainer-${index}"> </td>
                </div><td width="40%"><span class="fontesLegais">${x.nome}</span></td>
                <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}mod${property}-${index}"></td>
                <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}aloc${property}-${index}"></td>
                <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}total${property}-${index}"></td>
                </tr>`
        }
        item.savingThrow.forEach((x, index) => Template(x, index, 'savingThrow'))
        newHTML += `</table><table class="w-100"><tr><td colspan="7">Habilidades</td></tr>`
        item.proficiencias.forEach((x, index) => Template(x, index, 'proficiencias'))
        newHTML += `</table><table class="w-100"><tr><td colspan="7">Ataque</td></tr>`

        item.ataque.forEach((x, index) => {
            newHTML += /* html */ ` <tr>
            <div><td width="10%"> <img src="DadosDesvantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}ataquebuttonDesvantagemContainer-${index}"> </td>
            <td width="10%"> <img src="DadoCinza.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}ataquebuttonContainer-${index}"> </td>
            <td width="10%"> <img src="DadosVantagem.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}ataquebuttonVantagemContainer-${index}"></td>
            <div><td width="40%"><input class="fundoPretoDois fontesLegais" id="${idName}nomeataque-${index}"></td>
            <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}modataque-${index}"></td>
            <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}alocataque-${index}"></td>
            <td width="10%"><input class="fundoPretoDois fontesLegais" id="${idName}totalataque-${index}"></td>
            <td width="10%"><button class="bg-dark" id="${idName}ataqueClose-${index}">X</button></td></tr>`
        })

        newHTML += `</table><div class="botaoAdicionarContainer">
        <button class="bg-dark" id="${idName}ataqueAdd">+</button>
        </div>`
        if(nomePet != null){
            newHTML += `<table class="w-100"><tr><td colspan="7">Combate</td></tr>
            <tr class="fontesLegais">
            <td></td>
            <td width="50%">Nome</td>
            <td width="35%">Dano</td>
            <td width="10%">Rng</td>
            <td width="5%"> </td>
        </r>`
            item.combate.forEach((x, index) => {
                newHTML += /* html */ `
                <tr>
                    <td> <img src="Dado.png" class="retrato2" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${idName}combatebuttonContainer-${index}"> </td>
                    <td><input class="fundoPretoDois fontesLegais fonteBonita" id="${idName}nomecombate-${index}"></td>
                    <td><input class="fundoPretoDois fontesLegais" id="${idName}dadoscombate-${index}"></td>
                    <td><input class="fundoPretoDois fontesLegais" id="${idName}rangecombate-${index}"></td>
                    <td><button class="bg-dark" id="${idName}combateClose-${index}">X</button></td>
                    </tr> `
            })
            newHTML += `</table><div class="botaoAdicionarContainer">
                <button class="bg-dark" id="${idName}combateAdd">+</button>
                </div>`
        }
        elementoPai.innerHTML = newHTML

        const propriedades = ["proficiencias", "savingThrow", "ataque"]
        propriedades.forEach(y => {
            item[y].forEach((x, index) => {

                const modInput: any = document.querySelector(`#${idName}mod${y}-${index}`)
                modInput.addEventListener("keyup", (event) => {
                    ficha.salvarDadosTabela(event, item[y][index], 'modificador', idName)
                })
                modInput.value = x.modificador || ''

                const alocInput: any = document.querySelector(`#${idName}aloc${y}-${index}`)
                alocInput.addEventListener("keyup", (event) => {
                    ficha.salvarDadosTabela(event, item[y][index], 'alocado', idName)
                })
                alocInput.value = x.alocado || ''

                const totalInput: any = document.querySelector(`#${idName}total${y}-${index}`)
                totalInput.addEventListener("keyup", (event) => {
                    ficha.salvarDadosTabela(event, item[y][index], 'valor', idName)
                })
                totalInput.value = x.valor || ''

                if (y === 'ataque' || y === 'combate') {
                    const nomeInput: any = document.querySelector(`#${idName}nome${y}-${index}`)
                    nomeInput.addEventListener("keyup", (event) => {
                        ficha.salvarDadosTabela(event, item[y][index], 'nome', idName)
                    })
                    nomeInput.value = x.nome || ''

                    const closeButton: any = document.querySelector(`#${idName}${y}Close-${index}`)
                    closeButton.addEventListener("click", (event) => {
                        ficha.apagarElementoArrayTabela(item[y], index, idName)
                    })
                }

                const dadoDesvantagemButton: any = document.querySelector(`#${idName}${y}buttonDesvantagemContainer-${index}`)
                dadoDesvantagemButton.addEventListener("click", (event) => {
                    ficha.gerarDado(x, 'desvantagem', 2, x.nome, nomePet)
                })
                const dadoButton: any = document.querySelector(`#${idName}${y}buttonContainer-${index}`)
                dadoButton.addEventListener("click", (event) => {
                    ficha.gerarDado(x, 'normal', 1, x.nome, nomePet)
                })
                const dadoVantagemButton: any = document.querySelector(`#${idName}${y}buttonVantagemContainer-${index}`)
                dadoVantagemButton.addEventListener("click", (event) => {
                    ficha.gerarDado(x, 'vantagem', 2, x.nome, nomePet)
                })
            })

        })

        if (nomePet) {
            const inputProficienciaPet: any = document.querySelector('.inputProficienciaPet')
            inputProficienciaPet.value = item.proficienciaBonus || ''
            const inputVidaPet: any = document.querySelector('.inputVidaPet')
            inputVidaPet.value = item.vida || ''
            const inputAcPet: any = document.querySelector('.inputAcPet')
            inputAcPet.value = item.ac || ''

            const addButton: any = document.querySelector(`#${idName}combateAdd`)
            addButton.addEventListener("click", (event) => {
                ficha.adicionarElementoArrayTabela(item.combate)
            })

            item.combate.forEach((x, index) => {    
                const nomeInput: any = document.querySelector(`#${idName}nomecombate-${index}`)
                nomeInput.addEventListener("keyup", (event) => {
                   ficha.salvarDadosTabela(event, item.combate[index], 'nome', idName)
                })
                nomeInput.value = x.nome || '' 
                
                const closeButton: any = document.querySelector(`#${idName}combateClose-${index}`)
                closeButton.addEventListener("click", (event) => {
                    ficha.apagarElementoArrayTabela(item.combate, index, idName)
                })
                
                const dadoInput: any = document.querySelector(`#${idName}dadoscombate-${index}`)
                dadoInput.addEventListener("keyup", (event) => {
                    ficha.salvarDadosTabela(event, item.combate[index], 'dados', idName)
                })
                dadoInput.value = x.dados || ''
                    
                const rangeInput: any = document.querySelector(`#${idName}rangecombate-${index}`)
                rangeInput.addEventListener("keyup", (event) => {
                    ficha.salvarDadosTabela(event, item.combate[index], 'range', idName)
                })
                rangeInput.value = x.range || ''

                const dadoCombateButton: any = document.querySelector(`#${idName}combatebuttonContainer-${index}`)
                dadoCombateButton.addEventListener("click", (event) => {
                    ficha.gerarDadoCombatePets(index, nomePet)
                })
            })

            
        }

        const addButton: any = document.querySelector(`#${idName}ataqueAdd`)
        addButton.addEventListener("click", (event) => {
            ficha.adicionarElementoArrayTabela(item.ataque)
        })
    }

    private imprimirListaMagias() {
        const elementoPai = document.querySelector("#magias")
        let newHTML = ''
        newHTML = `<thead class="fontesLegais">
                <td width=45% >Nome</td>
                <td width=10%>Rng</td>
                <td width=10%>Lv</td>
                <td width=15%>Cast</td>
                <td width=15%>Tempo</td>
                <td width=5%></td>
                </thead>`
        
        this.spellsSlotsArray.forEach((x, index) => {
            newHTML += /*html*/ `<table>
            <tr>    
                <td colspan="7">
                    <div class="inputQuantidadeSpellSlotContainer">                
                        <span>${x.nivel}</span>
                        <div class="inputQuantidadeSpellSlotContainer">
                            <input class="fundoPretoDois fontesLegais inputQuantidadeSpellSlot" id="quantidadespellsSlotsArray-${index}" onkeyup="ficha.salvarLocalStorage(event, 'quantidade', ${index}, 'spellsSlotsArray')">
                            <button class="bg-dark" id="botaoAdicionarSpell-${index}">+</button>
                        </div>
                    </div>
                </td>
            </tr>`
            x.magias.forEach((y, idx) => {
                newHTML += /*html*/ `
                    <tr>
                        <td><input class="fundoPretoDois fontesLegais" id="magiasNome-${index}-${idx}" onkeyup="ficha.salvarDadosMagias(event, ${index}, ${idx}, 'nome')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="magiasRng-${index}-${idx}" onkeyup="ficha.salvarDadosMagias(event, ${index}, ${idx}, 'range')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="magiasLv-${index}-${idx}" onkeyup="ficha.salvarDadosMagias(event, ${index}, ${idx}, 'nivel')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="magiasCast-${index}-${idx}" onkeyup="ficha.salvarDadosMagias(event, ${index}, ${idx}, 'castingTime')"></td>
                        <td><input class="fundoPretoDois fontesLegais" id="magiasTempo-${index}-${idx}" onkeyup="ficha.salvarDadosMagias(event, ${index}, ${idx}, 'duracao')"></td>
                        <td><button class="bg-dark" id="botaoExcluirSpell-${index}-${idx}">X</button></td>
                    </tr>`
                })
            newHTML += /*html*/ `</table>`
        })
        elementoPai.innerHTML = newHTML
        this.spellsSlotsArray.forEach((x, index) => {
            const nivelInput: any = document.querySelector(`#quantidadespellsSlotsArray-${index}`)
            nivelInput.value = x.quantidade || ''
            x.magias.forEach((y, idx) => {
                const nomeInput: any = document.querySelector(`#magiasNome-${index}-${idx}`)
                nomeInput.value = y.nome || ''
                const rngInput: any = document.querySelector(`#magiasRng-${index}-${idx}`)
                rngInput.value = y.range || ''
                const lvInput: any = document.querySelector(`#magiasLv-${index}-${idx}`)
                lvInput.value = y.nivel || ''
                const castInput: any = document.querySelector(`#magiasCast-${index}-${idx}`)
                castInput.value = y.castingTime || ''
                const tempoInput: any = document.querySelector(`#magiasTempo-${index}-${idx}`)
                tempoInput.value = y.duracao || ''

                const botaoExcluirSpell: any = document.querySelector(`#botaoExcluirSpell-${index}-${idx}`)
                botaoExcluirSpell.addEventListener("click", (event) => {
                    ficha.apagarElementoArrayTabela(x.magias, idx, 'spellsSlotsArray')
                })
            })

            const botaoAdicionarSpell: any = document.querySelector(`#botaoAdicionarSpell-${index}`)
            botaoAdicionarSpell.addEventListener("click", (event) => {
                ficha.adicionarElementoArrayTabela(x.magias)
            })
        })
    }

    private imprimirInventario() {
        const elementoPai = document.querySelector("#inventario")
        let newHTML = `<thead class="fontesLegais">
                <td width=95% >Nome</td>
                <td width=5%>Peso</td>
                </thead>`
        this.inventario.forEach((x, index) => {
            newHTML += ` <tr>
                <td><input class="fundoPretoDois fontesLegais fonteBonita" id="nomeInventario-${index}" onkeyup="ficha.salvarLocalStorage(event, 'nome', ${index},'inventario')"></td>
                <td><input class="fundoPretoDois fontesLegais" id="pesoInventario-${index}" onkeyup="ficha.salvarLocalStorage(event, 'peso', ${index},'inventario')"></td>
                <td><button class="bg-dark" onclick="ficha.apagarElementoArray(${index},'inventario')">X</button></td>
                </tr> `
        })
        elementoPai.innerHTML = newHTML
        this.inventario.forEach((x, index) => {
            const nomeInput: any = document.querySelector(`#nomeInventario-${index}`)
            nomeInput.value = x.nome || ''
            const pesoInput: any = document.querySelector(`#pesoInventario-${index}`)
            pesoInput.value = x.peso || ''
        })
    }

    private imprimirFicha() {
        this.imprimirAtributos()
        this.imprimirCombate()
        this.imprimirProficiencias('Habilidades', this.habilidades, 'habilidades')
        if (this.petSelecionado !== null) {
            this.imprimirProficiencias('Pets', this.pets.find(x => x.nome === this.petSelecionado), 'pets', this.petSelecionado)
        }
        this.imprimirInventario()
        this.imprimirGenericRoll()
        this.imprimirListaPets()
        this.imprimirListaMagias()

        const Input: any = document.querySelector(`#vidaInput`)
        Input.value = this.vida.min + '/' + this.vida.max

        const Input2: any = document.querySelector(`#vidaTempInput`)
        Input2.value = this.vida.temporaria

        const camposTexto = [["jogadorInput", this.dados.nomeJogador], ["nomeInput", this.dados.nomePersonagem], ["idadeInput", this.dados.idade], ["profissaoInput", this.dados.profissao], ["generoInput", this.dados.genero], ["origemInput", this.dados.origem], ["notasTexto", this.notas]]
        camposTexto.forEach(x => {
            const elemento: any = document.querySelector(`#${x[0]}`)
            elemento.value = x[1]
        })

        const status = ["armorClass", "movimento", "spellsSlots", "profBonus", "hitDiceValue", "hitDiceQuantity"]
        status.forEach((x: string) => {
            const Input: any = document.querySelector(`#${x}Input`)
            Input.value = this[x]
        })

        const checkboxStatus = ["normal", "ferido" , "morrendo" ,"morto"]
        checkboxStatus.forEach((x: string) => {
            const Input: any = document.querySelector(`#status${x}`)
            Input.checked = this[x]
        })
    }

    private imprimirListaPets() {
        const elementoPai = document.querySelector(".petsSelect")
        let newHTML = ''
        this.pets.forEach(x => {
            newHTML += `<option value="${x.nome}">${x.nome}</option>`
        })
        elementoPai.innerHTML = newHTML;
        (elementoPai as any).value = this.petSelecionado
    }

    private adicionarPet() {
        const elementoPai = document.querySelector('.petsSelect')
        var opcaoNova = document.createElement('option')
        const promptText = prompt("Nome do Pet")
        if (promptText === null) return
        opcaoNova.textContent = promptText;
        this.pets.push({
            nome: opcaoNova.textContent,
            proficienciaBonus: 0,
            vida: '',
            ac: '',
            proficiencias: proficiencias.map(x => ({ nome: x, modificador: 0, alocado: 0, valor: 0 })),
            savingThrow: savingThrow.map(x => ({ nome: x, modificador: 0, alocado: 0, valor: 0 })),
            ataque: [],
            combate: []
        })
        elementoPai.appendChild(opcaoNova);
        
        localStorage.setItem(`${this.id}_pets`, JSON.stringify(this.pets))
        this.petSelecionado = opcaoNova.textContent
        this.imprimirFicha()
    }

    private excluirPet() {
        const elementoPai = document.querySelector('select')
        var opcaoExcluir = elementoPai.options[elementoPai.selectedIndex];
        this.pets.splice(this.pets.findIndex(x => x.nome === opcaoExcluir.value), 1)
        elementoPai.removeChild(opcaoExcluir);
        localStorage.setItem(`${this.id}_pets`, JSON.stringify(this.pets))
        this.petSelecionado = this.pets[0]?.nome || null
        document.querySelector(".containerPets").innerHTML = ''
        const inputPets = document.querySelectorAll(".petSelectorContainer input")
        inputPets.forEach((x: any) => x.value = '')        

        this.imprimirFicha()
    }

    private selecionarPet(e) {
        this.petSelecionado = e.target.value
        this.imprimirFicha()
    }

    private adicionarElementoArray(property: string) {
        this[property].push({})
        this.imprimirFicha()
    }

    private adicionarElementoArrayTabela(item: any) {
        item.push({})
        this.imprimirFicha()
    }

    private apagarElementoArrayTabela(item: any, index: number, title: string) {
        item.splice(index, 1)
        localStorage.setItem(`${this.id}_${title}`, JSON.stringify(this[title]))
        this.imprimirFicha()
    }

    private apagarElementoArray(index: number, property: string) {
        this[property].splice(index, 1)
        localStorage.setItem(`${this.id}_${property}`, JSON.stringify(this[property]))
        this.imprimirFicha()
    }

    private salvarDadosMagias(e: any, index: number, idx: number, property: string){
        this.spellsSlotsArray[index].magias[idx][property] = e.target.value
        localStorage.setItem(`${this.id}_spellsSlotsArray`, JSON.stringify(this.spellsSlotsArray))
    }

    private salvarDadosPessoais(e: any, seletor: string) {
        this.dados[seletor] = e.target.value
        localStorage.setItem(`${this.id}_dados`, JSON.stringify(this.dados))
    }

    private salvarStatus(e: any, property: string) {
        this[property] = e.target.value
        localStorage.setItem(`${this.id}_${property}`, JSON.stringify(this[property]))
    }

    private salvarLocalStorage(e: any, seletor: string, index: number, property: string) {
        this[property][index][seletor] = e.target.value
        localStorage.setItem(`${this.id}_${property}`, JSON.stringify(this[property]))
    }

    private salvarLocalStoragePet(e: any, property: string) {
        this.pets.find(x => x.nome === this.petSelecionado)[property] = (property === 'proficienciaBonus') ? parseInt(e.target.value) : e.target.value
        localStorage.setItem(`${this.id}_pets`, JSON.stringify(this.pets))
    }

    private salvarDadosTabela(e: any, item: any, property: string, titulo: string) {
        item[property] = e.target.value
        localStorage.setItem(`${this.id}_${titulo}`, JSON.stringify(this[titulo]))
    }

    private mudarCheckbox(e: any, text: string) {
        const optins = ["normal","ferido", "morrendo" ,"morto"]
        optins.forEach(x => {
            this[x] = false
            localStorage.setItem(`${this.id}_${x}`, JSON.stringify(this[x]))   
        });
        this[text] = e.target.checked
        localStorage.setItem(`${this.id}_${text}`, JSON.stringify(this[text]))
        this.condicao = text
        localStorage.setItem(`${this.id}_condicao`, JSON.stringify(this.condicao))
        this.salvarCondicaoFirebase()
    }

    deathSave(e: any, isDeathSave: boolean){
        const deathSaveContainer: any = document.querySelector("#deathSaveContainer")
        if(!isDeathSave){
            deathSaveContainer.innerHTML = ''
            return
        }
        ficha.salvarDeathSaveFirebase('sucesso',0)
        ficha.salvarDeathSaveFirebase('fracasso',0)
        deathSaveContainer.innerHTML = /*HTML*/ ` 
            <div>
                <span>Sucesso:</span>
                <div>
                    <input type="radio" name="deathsaveSucesso" onchange="ficha.salvarDeathSaveFirebase('sucesso',1)">    
                    <input type="radio" name="deathsaveSucesso" onchange="ficha.salvarDeathSaveFirebase('sucesso',2)">
                    <input type="radio" name="deathsaveSucesso" onchange="ficha.salvarDeathSaveFirebase('sucesso',3)">
                </div>    
            </div>
            <div>
                <span>Fracasso:</span>
                <div>
                    <input type="radio" name="deathsaveFracasso" onchange="ficha.salvarDeathSaveFirebase('fracasso',1)">
                    <input type="radio" name="deathsaveFracasso" onchange="ficha.salvarDeathSaveFirebase('fracasso',2)">
                    <input type="radio" name="deathsaveFracasso" onchange="ficha.salvarDeathSaveFirebase('fracasso',3)">
                </div>    
            </div>
        `
    }

    private mudarCaracteristica(e: any) {
        this.vida.min = e.target.value.split('/')[0]
        this.vida.max = e.target.value.split('/')[1]
        localStorage.setItem(`${this.id}_vida`, JSON.stringify(this.vida))
        this.salvarStatusFirebase()
    }

    private mudarVidaTemp(e: any) {
        this.vida.temporaria = e.target.value
        localStorage.setItem(`${this.id}_vida`, JSON.stringify(this.vida))
        this.salvarStatusFirebase()
    }

    private mudarArmorClass(e: any) {
        this.armorClass = e.target.value
        localStorage.setItem(`${this.id}_armorClass`, JSON.stringify(this.armorClass))
        this.salvarArmorClassFirebase()
    }

    private salvarArmorClassFirebase() {
        const batch = db.batch()
        const collection = db.collection("Jogadores").doc(this.id)
        batch.update(collection, { armorClass: this.armorClass })
        batch.commit()
    }

    private salvarCondicaoFirebase() {
        const batch = db.batch()
        const collection = db.collection("Jogadores").doc(this.id)
        batch.update(collection, { condicao: this.condicao })
        batch.commit()
    }

    private salvarDeathSaveFirebase(type: string, value: number){
        const batch = db.batch()
        const collection = db.collection("Jogadores").doc(this.id)
        batch.update(collection, { [type]: value })
        batch.commit()
    }

    private salvarStatusFirebase() {
        const batch = db.batch()
        const collection = db.collection("Jogadores").doc(this.id)
        batch.update(collection, { vida: this.vida })
        batch.commit()
    }

    private salvarDadoFirebase(dadosGirados: Array<{ value: number, modificador?: number }>, titulo: string, diceType: string, rollType: string, petName: string) {
        const batch = this.db.batch()
        const dadoRef = this.db.collection("Jogadores").doc("Dado");
        const dadoMudado = {
            idDocumento: this.id,
            dadosGirados,
            titulo,
            diceType,
            rollType,
            petName,
            id: (new Date()).getTime()
        }
        batch.update(dadoRef, dadoMudado)
        batch.commit()
    }

    private gerarDado(item: any, rollType: string, times: number, title: string, petName: string = null) {
        let newHTML = ''
        const dadosGirados: Array<{
            value: number
            modificador: number
        }> = []
        const resultados = []
        for (let i = 0; i < times; i++) {
            dadosGirados.push({
                value: Math.floor(Math.random() * 20) + 1,
                modificador: parseInt(item.valor)
            })
            if (dadosGirados[i].value == 20) {
                if (petName == null) {
                    dadosGirados[i].modificador += parseInt(this.profBonus)
                }
                else {
                    dadosGirados[i].modificador += this.pets.find(x => x.nome === petName).proficienciaBonus
                }
            }
            else if (dadosGirados[i].value == 1) {
                if (petName == null) {
                    dadosGirados[i].modificador -= parseInt(this.profBonus)
                }
                else {
                    dadosGirados[i].modificador -= this.pets.find(x => x.nome === petName).proficienciaBonus
                }
            }
            resultados.push(dadosGirados[i].value + dadosGirados[i].modificador)
            newHTML += this.textoModal(String(dadosGirados[i].value), String(resultados[i]))
        }


        this.mudarModal(newHTML, title + (petName !== null ? ' - ' + petName : ''))
        this.salvarDadoFirebase(dadosGirados, title, 'Generico', rollType, petName)
    }

    private gerarDadoCombate(index: number, property: string = 'combate', title: string = 'Combate', petName: string = null) {
        let result: Array<{
            value: number
        }> = []
        result.push({
            value: 0
        })
        let somaString: Array<string> = []
        const somaLista = this[property][index].dados.split("+")
        somaLista.forEach(q => {
            const itemSeparado = q.split("d")
            if (itemSeparado.length != 1) {
                for (let i = 0; i < parseInt(itemSeparado[0]); i++) {
                    const dadoGirado = Math.floor(Math.random() * parseInt(itemSeparado[1])) + 1
                    somaString.push(String(dadoGirado))
                    result[0].value += dadoGirado
                }
            }
            else {
                result[0].value += parseInt(itemSeparado[0])
                somaString.push(itemSeparado[0])
            }
        })
        title = (property === 'combate') ? title : this[property][index].nome
        this.mudarModal(this.textoModal(somaString.join("+"), String(result[0].value), 'Dados'), title)
        this.salvarDadoFirebase(result, title, property, null, petName)
    }

    gerarDadoCombatePets(index: number, petName: string){
        let result: Array<{
            value: number
        }> = []
        result.push({
            value: 0
        })
        let somaString: Array<string> = []
        const somaLista = this.pets.find(x => x.nome === petName).combate[index].dados.split("+")
        somaLista.forEach(q => {
            const itemSeparado = q.split("d")
            if (itemSeparado.length != 1) {
                for (let i = 0; i < parseInt(itemSeparado[0]); i++) {
                    const dadoGirado = Math.floor(Math.random() * parseInt(itemSeparado[1])) + 1
                    somaString.push(String(dadoGirado))
                    result[0].value += dadoGirado
                }
            }
            else {
                result[0].value += parseInt(itemSeparado[0])
                somaString.push(itemSeparado[0])
            }
        })
        this.mudarModal(this.textoModal(somaString.join("+"), String(result[0].value), 'Dados'), 'Combate - ' + petName)
        this.salvarDadoFirebase(result, 'Combate', 'combate', null, petName)
    }

    private textoModal(dado: string, resultado: string, dadoTexto: string = "Dados") {
        return (`<div>${dadoTexto}: <p class="text-white" id="numeroDado">${dado}</p>
        Resultado: <p class="text-white" id="resultadoDado">${resultado}</p></div>`)
    }

    private mudarModal(html: string, titulo: string) {

        const containerResultados = document.querySelector('#modalResultadoDadosContainer')
        const tituloResultados = document.querySelector('#resultadoTitulo')
        tituloResultados.innerHTML = `${titulo}`
        containerResultados.innerHTML = html
    }
}

declare var db: any
const usuario: any = new URLSearchParams(window.location.search).get('usuario')
const ficha = new Ficha(usuario, db)