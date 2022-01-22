//console.log ("Hola")

// Se cargan los datos en un nueva ubicación ya que no se obtuvo permisos sobre la dirección original

d3.json ("https://raw.githubusercontent.com/camiloflorez1013/HDV/main/Examen.json").then (function (datos){
    
    
//    console.log ("los datos ya se han recibido")
//    console.log(datos)
    
    // se define las dimensiones de la gráfica
    var height = 400
    var width = 800
    
    // se definen las márgines a emplear para evitar que la gráfica quede contra los bordes
    var margin  = {
        top: 50,
        botton: 50,
        left:50,
        right:50}
    
    // Se crea el elemento svg que representará el gráfico de dispersión
    var elementosvg=d3.select ("body")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
    
    // se escalan las variables x y y
    // Para la escala de X se usan los datos del ranking
    var escalaX = d3.scaleLinear()
        .domain (d3.extent(datos, d => d.ranking))
        .range ([30 + margin.left, width - margin.right])
    
    // Para la escala de Y se usa un dominio fijo para garantizar que la gráfica se vea entre 0 y 10
    var escalaY= d3.scaleLinear()
        .domain ([0,10])
        .range ([height - margin.botton, 0 + margin.top])
        
        
    // Se crea la variable para el objeto eje X
    // Se definen 4 ticks para que quede como la imagen del examen
    var ejeX = d3.axisBottom (escalaX)
        .ticks (4)
        .tickFormat (d3.format(".3s"))
    
           
    //Se incluye el Eje X sobre la gráfica, incluyendo una transición de aparición
    elementosvg
        .append("g")
        .transition()
        .duration(500)
        .attr("transform","translate (0," + (height - margin.botton+5) + ")")
        .call(ejeX)
              
              
    // Se crea la variable para el objeto eje Y
    var ejeY = d3.axisLeft (escalaY)
    
    //Se incluye el Eje Y sobre la gráfica, incluyendo una transición de aparición
    elementosvg
        .append("g")
        .transition()
        .duration(500)
        .attr("transform","translate (" + margin.left + ",0)")
        .call(ejeY)
    
    
    // Se crea la variable escalaColor que va del verde a rojo con la variable nota
    var escalaColor = d3.scaleLinear()
        .domain (d3.extent(datos, d => d.nota))
        .range (["red", "green"])
    
    // Se crea la variable escala de tamaño en funcion de la variable ranking
    var escala_tamanio = d3.scaleLinear()
        .domain (d3.extent(datos, d => d.ranking))
        .range([25,8])
         
    // se pintan los circulos a partir de los atributos definidos
    // Se incluye la acción del movimiento del mouse para la aparición y desaparición del tooltip
    elementosvg
        .selectAll("circle") 
        .data(datos) 
        .enter()
        .append ("circle")
        .attr("r", d => escala_tamanio(d.ranking)) 
        .attr ("cx", d => escalaX(d.ranking))
        .attr("cy",d => escalaY(d.nota))
        .attr ("fill", d => escalaColor(d.nota))
        .on ("mouseover", d => {pintarTooltip (d)})
        .on ("mouseout", borrarTooltip)
    
    // Se define la variable tooltip
    var tooltip = d3.select ("body")
        .append("div")
        .attr("class","tooltip")
     
     // Función para borrar el tooltip para cuando el mouse salga del circulo
     function borrarTooltip(){
         tooltip    
            .transition()
            .style("opacity",0)         
     }
    
    // Función para pintar el tooltip para cuando el mouse salga del circulo
    function pintarTooltip(d){
        tooltip
            .text(d.alumno +" - " + d.nota)
            .style ("top", d3.event.pageY + "px")  
            .style ("left", d3.event.pageX + "px")
            .transition()
            .style("opacity",1)
        }
    
    })