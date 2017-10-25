"use strict";
/*
	Essa classe cuida do trabalho
	de colocar parenteses nos lugares
	certos em todas as expressões.
	Por exemplo a expressão: 'p^q>~k'
	após passar por aqui ficaria:
	'(p^q)>(~(k))'.

*/
class PutParenthesis
{
	/*
		Serve para descobrir em que posição (index)
		da string termina um bloco de parenteses.

		Recebe:
			${exp}   
				Expressão a ser analizada.
			${begin} 
				Em que posição da string começa
				começa a area delimitada pelos
				parenteses.
		Retorna:
			O index do caractere, ')', que termina
			a área delimitada pelos parenteses, se
			existir.
			-1 Caso caso não exista um caractere de
			')' que corresponda ao index do carac-
			tere '(' fornecido.
	*/
	whereClose(exp, begin)
	{
		let n = 0;
		for (let i = begin; i < exp.length; i++) 
		{
			if(exp.substring(i, i+1) === "(")
				n++;
			else if(exp.substring(i, i+1) === ")")
				n--;
			if(n === 0)
				return i;
		}
		return -1;
	}

	/*
		Serve para descobrir em que posição (index)
		da string começa um bloco de parenteses.

		Recebe:
			${exp}   
				Expressão a ser analizada.
			${end} 
				Em que posição da string termina
				a area delimitada pelos parenteses.
		Retorna:
			O index do caractere, '(', que começa
			a área delimitada pelos parenteses, se
			existir.
			-1 Caso caso não exista um caractere de
			'(' que corresponda ao index do carac-
			tere ')' fornecido.
	*/
	whereOpen(exp, end)
	{
		let n = 0;
		for (let i = end; i >= 0; i--)
		{
			if(exp.substring(i, i+1) === ")")
				n++;
			else if(exp.substring(i, i+1) === "(")
				n--;
			if(n == 0)
				return i;
		}
		return -1;
	}

	/*
		Coloca um parentese de abertura em uma po-
		sição x, e outro de fechamento em uma posi-
		ção y.
		Recebe:
			${begin} 
				Onde o parentese de abertura deve
				ser posto.
			${end}
				Onde o parentese correspondente ao
				de abertura deve ser posto.
			${exp}
				String a ser analizada
			${type}
				A bug fix...
		Retorna:
			A mesma string inicial com parenteses
			nas posições informadas.
	*/
	insertAndConcat(begin, end, exp, type="1")
	{
		let aux = ["", "", ""];
		if(type == 3 || type == 4)
			aux = ["(", ")", "!"];
		const part1 = exp.substring(0, begin) + aux[0] + aux[2]+ "(";
		const part3 = ")" + aux[1] + exp.substring(end, exp.length+1);
		const part2 = exp.substring(begin, end);
		return part1+part2+part3;
	}

	/*
		Cuida dos operadores lógicos que trabalham
		com duas entradas: ^, v, >, <->, analisando-os
		para poder colocar os parenteses nas posições
		certas.
		A expressão: pvq^r depois de passar por aqui fi-
		caria: (pv(q^r)).
		Recebe:
			${index} 
				Em que posição na string foi encon
				trada uma ocorrência de operador binário.
			${exp}
				A string que esta sendo analisada.
			${type}
				A bug fix, it will be removed soon
				as possible.
		Retonra:
			Uma nova string baseada na primeira
			com parenteses em seus devidos lugares.
	*/
	binaryOperator(index, exp, type="1")
	{
		let begin = -1, end = -1;
		if(exp.substring(index+1, index+2) != "(")
		{
			end = index+2;
		}
		else
		{
			let closeAt = this.whereClose(exp, index+1);
			end = (closeAt != -1 ? closeAt+1 : -1);
		}
		if(exp.substring(index-1, index) != ")")
		{
			begin = index-1;
		}
		else
		{
			let openAt = this.whereOpen(exp, index-1);
			begin = (openAt != -1 ? openAt : -1);
		}
		return this.insertAndConcat(begin, end, exp, type);
	}
	/*

		Cuida dos operadores lógicos que trabalham
		com apenas uma entrada, como ~, negação, 
		analisando-os para colocar os parênteses nas
		posições corretas.
		Por exemplo, a expressão: ~p após passar
		por esta função seria: (~p).
		Recebe:
			${index} 
				Em que posição na string foi encon
				trada uma ocorrência de operador unário.
			${exp}
				A string que esta sendo analisada.
		Retonra:
			Uma nova string baseada na primeira
			com parenteses em seus devidos lugares.
	*/
	unaryOperator(index, exp)
	{
		const next = exp.substring(index+1, index+2);
		if(next != "(" && next != "~")
		{
			return this.insertAndConcat(index, index+2, exp);
		}
		else if(next == "~")
		{
			const pro = exp.slice(index).search(/[a-z]/);
			const pro1 = exp.slice(index).search(/\(/);
			if(pro1 == -1)
			{
				return this.insertAndConcat(index, (pro+1+index), exp);
			}
			else
			{
				const end = this.whereClose(exp, pro1);
				return end == -1 ? -1 : this.insertAndConcat(index, end+1, exp);
			}
		}
		else
		{
			const end = this.whereClose(exp, index+1);
			return end == -1 ? -1 : this.insertAndConcat(index, end+1, exp);
		}
	}
	/*
		And finally the: 'get your shit together'
		Essa funçao percorre todo a string em busca
		de operadores para por parenteses neles.
		Quando ela acha um operador ^, por exemplo,
		ela chama a funçao binary operator 
		(função correspondente) para por os parenteses.

		Recebe:
			${exp} 
				A expressão sem parenteses na parte do
				operador a ser analisado
			${match}
				Operador a ser analisado
		Retonra:
			Uma nova string baseada na primeira
			com parenteses entre o operador ${match}.
	*/
	lookAheadAndMatch(exp, match)
	{
		let index = 0;
		while(index != exp.length)
		{
			let c = exp.substring(index, index+1);
			if(c === match)
			{
				switch(match)
				{
					case '~':
						exp = this.unaryOperator(index, exp);
					break;
					case '^':
						exp = this.binaryOperator(index, exp, 0);
					break;
					case 'v':
						exp = this.binaryOperator(index, exp, 0);
					break;
					case '>':
						exp = this.binaryOperator(index, exp, 0);
						//index+=3;
					break;
					case '-':
						exp = this.binaryOperator(index, exp, 0); 
					break;
					case '+':
						exp = this.binaryOperator(index, exp, 0);
					break;
				}
				index+=1;
			}
			index++;
		}
		return exp;
	}
	/*
		Chama a função lookaheadAndMatch para cada
		operador da expressão.

		Recebe:
			${exp} 
				Uma expressão sem parênteses
		Retonra:
			Uma expressão com parenteses em volta
			de cada operador.
	*/
	put(exp)
	{
		let index = 0;
		let operations = ['~', '^', 'v', '>', '-', '+'];
		while(index != operations.length)
		{
			exp = this.lookAheadAndMatch(exp, operations[index]);
			index++;
		}
		return exp;
	}
}

/*
	Essa classe tem o objetivo
	de dividir uma expressão
	com parentesis em um array
	de subpartes da expressão.
	Por exemplo a expressão: 'p^q>~k'
	após passar por aqui ficaria:
	['p', 'q', 'k', '(~k)', '(p^q)',
	((p^q)>(~(k)))]

*/
class SplitOnParenthesis
{
	/*
		Put your shit togheter function...
	*/
	getParts (expression)
	{
		return this.toStringArray(
			this.getPositions(expression),
			expression);
	}

	/*
		Essa função decide em que posições
		a string deve ser cortarda para
		formar as partes. Por exemplo a
		expressão: '((pvq)>k)' deve ser cortada
		nas partes: '[0, 8, 1, 5, 7, 7, 4, 4, 2, 2]'
		substr(0, 8) == ((pvq)>k)
		substr(1, 5) == (pvq)
		substr(7, 7) == k
		substr(4, 4) == q
		substr(p, p) == p

		Recebe:
			${exp}:
				A expressão a ser analisada (demarca
				por parenteses)
		Retorna:
			Um vetor onde n e n+1 formam
			o começo e o final da substring (inclusos)
			OBS: n0 = 0.
	*/
	getPositions(exp)
	{
		let indexes = [];
		for(let i = 0; i < exp.length; i++)
		{
			let char = exp.substring(i, i+1);
			if(char.match("[a-z]") && !char.match("v"))
			{
				indexes.unshift(i);
				indexes.unshift(i);
			}
		}
		for(let i = 0; i < exp.length; i++)
		{
			let char = exp.substring(i, i+1);
			if(char === "(")
				indexes.push(i);
			else if(char === ")")
			{
				let last = indexes.pop();
				indexes.unshift(i);
				indexes.unshift(last);
			}
		}
		return indexes;
	}

	/*
		Transforma o vetor de indexs
		da função acima em um vetor de
		expressões válidas. Basicamente
		a função acima informa onde deve-se
		cortar e esta função corta.

		Recebe:
			${indexes}
				Um vetor com indexs de onde
				cortar em ${exp}
			${exp}
				A expressão a ser cortada
		Retorna:
			Um vetor com as subpartes de ${exp}
			cortada nas posições em que ${indexes}
			indicou.
	*/
	toStringArray(indexes, exp)
	{
		let partsInd = [], partsChar = [];
		for(let i = indexes.length - 1; i >= 0; i-=2)
			partsInd.push([indexes[i-1], indexes[i]]);
		for(let k = 0; k < partsInd.length; k++)
		{
			let a = partsInd[k];
			partsChar[k] = exp.substring(a[0], (a[1]+1));
		}
		return this.treatEquivalantParts(partsChar);
	}

	/*
		Alugmas vezes o vetor de partes
		pode ter algumas partes equivalentes
		como p e (p), (pvq) e pvq.
		Essa função apaga essas partes...
	*/
	treatEquivalantParts(vect)
	{
		let novo = [], index = 0, i=0;
		for(let k = 0; k < vect.length; k++)
		{
			for(let l = k+1; l < vect.length; l++)
			{
				if("("+vect[k]+")" === vect[l] || vect[k] === vect[l])
					vect[l] = "hum";
			}
		}
		while(i != vect.length)
		{
			if(vect[i] != "hum")
			{
				novo[index] = vect[i];
				index++;
			}
			i++;
		}
		return novo;
	}
}

/*
	Essa classe tem o objetivo de
	transformar isso: 'v^f' em isso
	'true||false' ou seja algo em que
	a função eval (nativa do js) entenda.
	btw, this is not my best work...
*/
class MatrixFactory
{
	makeMatrix(linhas, coluna){
	    let k = new Array(linhas);
	    for(let i = 0; i < linhas; i++)
			k[i] = new Array(coluna);
		return k;
	}
	addHeader(matrix, header)
	{
		for(let i = 0; i < header.length; i++)
			matrix[0][i] = header[i];
		return matrix;
	}
	toHTMLTable (matrix)
	{
		let table = "";
		table+="<table class='table'>";
	    for(let i = 0; i < matrix.length; i++)
	    {
	    	table+="<tr>";
	    	for(let j = 0; j < matrix[0].length; j++)
	    	{
				let p = matrix[i][j];
		    	if(!document.querySelector("#theTruth").checked)
		    	{
			    	if(p.toString() =="true" || p.toString() == "false")
			    		table+="<td>"+(p.toString() == "true" ? "V" : "F")+"</td>";
			    	else
			    		table+="<td class='title'>"+p.replace(/>/g, "→").replace(/-/g, "↔")+"</td>";
			    }
			    else
			    {
			    	table += "<td>"+p+"</td>";
			    }
		  	}
		  	table+="</tr>";
		}
		table+="</table>";
		return table;
	}
	povoar (matrix, numPrep)
	{
		let linhas = Math.pow(2, numPrep);
		let metade = linhas/2;
		let valor = false;
		for(let i = 0; i < numPrep; i++)
		{
			for(let j = 0; j < linhas; j++)
			{
		  		if(j % metade == 0 && j != 0)
		    		valor = !valor;
		  		matrix[j+1][i] = (valor ? "true" : "false");
			}
			metade = metade / 2;
			valor = false;
	  	}
	  	return this.povoar_1(matrix, numPrep);
	}
	povoar_1 (matrix, numPrep)
	{
		let map = this.createMap(matrix, numPrep);
		for(let i = 1; i < matrix.length; i++)
		{
	    	map.changeValues(matrix[i]);
	    	for(let j = numPrep; j < matrix[i].length; j++)
	    	{
	    		let exp = this.conditionalBug(matrix[0][j], false);
	    		exp = this.conditionalBug(exp, true);
				map.keys.forEach((a, b, c)=>{
					exp = exp.replace(new RegExp(a, 'g'), "{"+a+"}");
				});
				matrix[i][j] = exp;
		  	}
		}
		for(let i = 1; i < matrix.length; i++)
		{
	    	map.changeValues(matrix[i]);
	    	for(let j = numPrep; j < matrix[i].length; j++)
				map.keys.forEach((a, b, c)=>{
					matrix[i][j] = matrix[i][j].replace(new RegExp("{"+a+"}", 'g'), map.get(a));
				});
		}
		return matrix;
	}
	solveMatrix (matrix, numPrep)
	{
		let oper = [["~", "!"], ["^", "&&"], ["v", "||"], ["-", "==="], ["+", "!=="]];
		for(let i = 1; i < matrix.length; i++)
		{
	    	for(let j = numPrep; j < matrix[i].length; j++)
	    	{
				oper.forEach((a, b, c) =>{
					let scaped = a[0].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
					matrix[i][j] = matrix[i][j].replace(new RegExp(scaped, 'g'), a[1]);
				});
				if(!document.querySelector("#theTruth").checked)
					matrix[i][j] = eval(matrix[i][j]);
		  	}
		}
		return matrix;
	}
	createMap (array, end)
	{
		return {
			keys : array[0].slice(0, end).map(function (m){
				return m;
			}),
			values : array[1].slice(0, end),
			get : function(element){
				let i = this.keys.indexOf(element);
				return this.values[i];
			},
			changeValues : function (values){
				this.values = values;
			}
		}
	}
	conditionalBug(exp, biconditional = false)
	{
		let indices = this.searchForConditional(exp, biconditional);
		if(indices.length == 0)
		{
			return exp;
		}
		else
		{
			let novo = indices;
			for (let i = 0; i < indices.length; i++)
			{
				exp = new PutParenthesis().binaryOperator(novo[i], exp, biconditional ? 0 : 3);
				novo = this.searchForConditional(exp);
			}
			return exp;
		}
	}
	searchForConditional (exp, biconditional = false)
	{

		let regex = />/gi, result, indices = [];
		if(biconditional)
			regex = /-/gi;
		while ((result = regex.exec(exp)))
		{
    		indices.push(result.index);
    	}
    	return indices;
	}
}

/*
	Checa a expressão procurando erros
	mas nem sempre vai achar todos :(
*/
class CheckErros
{
	matchParenteses(exp)
	{
		return (exp.match(/\(/g) || []).length === (exp.match(/\)/g) || []).length;
	}
	matchOperators(exp)
	/* Regex é pros fracos :(  */
	{
		//let oper = ["(", ")", "~", "^", "v", "→", "↔", "+"];
		let shits = ["()", "(^", "(v", "(→", "(↔", "(+", 
					  ")(", ")~",
					  "~)", "~^", "~v", "~→", "~↔", "~+",
					  "^)", "^^", "^v", "^→", "^↔", "^+",
					  "v)", "v^", "vv", "v→", "v↔", "v+",
					  "→)", "→^", "→v", "→→", "→↔", "→+",
					  "↔)", "↔^", "↔v", "↔→", "↔↔", "↔+",
					  "+)", "+^", "+v", "+→", "+↔", "++",
					  "pp", "qq", "rr", "ss"];
		//return shits.some(a => !exp.includes(a));
		for(let a of shits)
			if(exp.includes(a))
				return false;
		return true;
	}
	check(exp)
	{
		if(exp.search("[a-z]") === -1)
			return false;
		if(this.matchParenteses(exp) === false)
			return false;
		return this.matchOperators(exp);
	}
}
const pp = new PutParenthesis();
const sp = new SplitOnParenthesis();
const mf = new MatrixFactory();
const err = new CheckErros();
const start = (exp, board) => 
{
	try
	{
		if(!err.check(exp))
			throw "Expressão inválida";
		let exp_parenthesis = pp.put(exp);
		let exp_parts = sp.getParts(exp_parenthesis);
		let numPrep = exp_parts.filter((value, a, b) => (value.length == 1)).length;
		let matrix = mf.makeMatrix(Math.pow(2, numPrep)+1, exp_parts.length);
		matrix = mf.addHeader(matrix, exp_parts);
		matrix = mf.povoar(matrix, numPrep);
		matrix = mf.solveMatrix(matrix, numPrep);
		board.innerHTML = (mf.toHTMLTable(matrix));
		return matrix;
	}catch(err){
		display.innerText = "";
		return alert("Expressão inválida!");
	}
}
onload = () => 
{
	const insertButtons = document.getElementsByClassName("no-act");
	const allButtons = document.getElementsByClassName("calc-buttons-btn");
	const display = document.querySelector("#display");
	const board = document.querySelector(".table-wrapper");
	document.querySelector("#del-one").addEventListener("click", () => {
		let string = display.innerText;
		string = string.substring(0, string.length-1);
		display.innerText = string;		
	});
	document.querySelector("#eval").addEventListener("click", () => {
		let text = display.innerText.replace(/→/g, ">").replace(/↔/g, "-");
		start(text, board);		
	});
	document.querySelector("#del-all").addEventListener("click", () => {
		display.innerText = "";
		board.innerHTML = "";	
	});
	for(let btn of insertButtons)
		btn.addEventListener("click", () => display.innerText += btn.innerText);
}