;(function(){

    let students = null
    

    const init = (_students) => {
        students = _students
        
        createDomIntoTable(_students)

        addListenerToButton()
    }

    const createDomIntoTable = (students) => {
        
        const str = students.map( (student, i) => {
            
            return `
            <tr>
                <td>${student.nome}</td>
                ${
                    student.notas.map( nota => `<td> ${nota} </td>`).join('')
                }
                <td>${getMedia(...student.notas)} </td>

            </tr>
            `
        } ).join('')
        //- ${student.media.toFixed(2)}

        document.querySelector('#content-students').innerHTML = str
    }

    function getMedia(){
        // console.log(arguments)
        let notas = Array.from(arguments)
        let media = (notas.reduce( (current, sum) => {
            return current + sum
        }) / notas.length) 
        
        return media.toFixed(2)
    }

    const createDomIntoList = (luckyStudents) =>{
        const str = luckyStudents.map( s => {
            
            return `
                <li class="list-group-item" id="student-${s.i}">${s.nome} <span style="float:right">${s.media} </span></li>
            `
        }).join('')

        document.querySelector('#results ul').innerHTML = str       
        
    }

    const addListenerToButton = function(){
        
        const $btn = document.querySelector('#btn-init')
        $btn.removeAttribute('disabled')
        $btn.addEventListener('click', e => {
            const _students = Array.from(students)
            let luckyStudents = []
            
            while(luckyStudents.length < 5){
                let nRandon = getRandonNumber(0, _students.length - 1)
                
                let student = _students.splice(nRandon, 1)
                luckyStudents.push(student[0])
            }

            

            //pegar o maior valor de media
            let medias = [] 
            // luckyStudents.forEach( (lucky, i) => {
            //     medias[i] = lucky.media                
            //     lucky.i = i
            // } )
            luckyStudents.map( (ls, i) => {
                medias[i] = ls.media
                ls.i = i
                return ls;
            })

            createDomIntoList(luckyStudents)

            console.log(medias)

            const maxValue = Math.max(...medias)
            console.log(maxValue)

            const studentsWinner = luckyStudents.filter( (student, i) => {
                return student.media === maxValue
            })

            console.log(studentsWinner)

            if(studentsWinner.length === 1){
                showsTheWinner(studentsWinner[0])
            } else {
                let nLucky = getRandonNumber(0, studentsWinner.length - 1)
                showsTheWinner(studentsWinner[nLucky])
            }
        })
    }

    const showsTheWinner = (luckyStudent) => {

        document.querySelector(`#student-${luckyStudent.i}`).style.backgroundColor = 'green'
    }

    const getRandonNumber = (min, max) => {
        let r = Math.random() * (max - min + 1) + min;
        return parseInt(r)
    }

    /* 
    5 - 8
    Math.random() * (8 - 5 + 1) + 5
    Math.random() * 4 + 5
    0.0 * 4 + 5 = 0 + 5 = 5
    0.99 * 4 + 5 = 3.96 + 5 = 8.96
    */

    //carrega os dados do jon    
    const getStudents = async () => {
        const url_json = 'https://serfrontend.com/fakeapi/alunos.json'
        const response = await fetch(url_json)
        let data = await response.json()

        //primeiro eu tinha chamado o getMedia só na hora de mostrar na tabela
        //mas melhor tratar aqui com um .map()
        data.map( (s) => {            
            s.media = parseFloat(getMedia(...s.notas) )
        })
        
        
        if (response.status !== 200) {
            throw Error(data.detail);
        }

        return data
        
    } 
    getStudents()
        .then(students => init(students))
        .catch(err => console.error(err))

    //console.log('oi') //acontece antes se nao tiver async/await
})()