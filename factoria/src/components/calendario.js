import React, { useState, useEffect } from 'react'
import '../css/calendario.css';

/* Calendario de eventos
*
*   props:
*       fechas: Array(Objs), objExamp: {inicio:'yyyy/mm/dd',fin:'yyyy/mm/dd',color:'#fff',todos:bool}
*       clickDia: func(year,month,day)
*       cambioMes: func(year,month)
*/
const Calendario = (props) => {

    let today = new Date()

    const[year,setYear] = useState(today.getFullYear())
    const[month,setMonth] = useState(today.getMonth())
    //const[day,setDay] = useState(today.getDate())
    const[hoy,setHoy] = useState(today.getFullYear()+'/'+today.getMonth()+'/'+today.getDate())
    const[tabla,setTabla] = useState([])
    const[fechas,setFechas] = useState([])

    // Crea la tabla de calendarios
    useEffect(() => {
        const diasMes         = new Date(year,month + 1,0).getDate()
        // const diasMesAnterior = new Date(year,month,0).getDate()
        const diaInicio       = new Date(year,month,1).getDay()

        var tablaMes = new Array()

        var dia = 1
        var inicia = false
        var fin = false;
        var semana = 0
        semana: while( !fin ){
            tablaMes[semana] = new Array()
            dia: for (var i = 0; i < 7; i++) {
                if(diaInicio == i && !inicia)
                    inicia = true

                if(inicia){
                    if(dia > diasMes){
                        fin = true
                        tablaMes[semana][i] = -1
                    }else{
                        tablaMes[semana][i] = dia
                        dia++
                    }
                    continue dia
                }

                tablaMes[semana][i] = -1
            }
            if(dia > diasMes){
                break semana
            }
            semana++
        }
        setTabla(tablaMes)
    },[month,year])


    // Establecer las fechas
    useEffect(() => {
        var listaFechas = []
        if(props.fechas !== undefined){
        props.fechas.forEach(f => {
            var startCiclo = 1
            var endCiclo = new Date(year,month + 1,0).getDate()
            let mesInicio = new Date(f.inicio).getMonth()
            let mesFin = new Date(f.fin).getMonth()

            if(mesInicio == month)
                startCiclo = new Date(f.inicio).getDate()

            if(mesFin == month)
                endCiclo = new Date(f.fin).getDate()

            if(mesInicio == month || mesFin == month){
                if(f.todos || f.todos === undefined){
                    for (let i = startCiclo; i <= endCiclo; i++) {
                        listaFechas[i] = (listaFechas[i] === undefined) ? f.color :'#666'
                    }
                }else{
                    if(mesInicio == month){
                        listaFechas[startCiclo] = (listaFechas[startCiclo] === undefined) ? f.color :'#666'
                    }
                    if(mesFin == month){
                        listaFechas[endCiclo] = (listaFechas[endCiclo] === undefined) ? f.color :'#666'
                    }
                }
            }
            setFechas(listaFechas)
        })
        }
    },[props.fechas,month])

    // cambio mes
    useEffect(() => {
        if(props.cambioMes !== undefined)
            props.cambioMes(year,month + 1)
    },[month])

    // Click en siguiente mes
    function nextMonth(){
        if(month == 11){
            setYear(year + 1)
            setMonth(0)
        }else{
            setMonth(month + 1)
        }
    }

    // Click en mes anterior
    function prevMonth(){
        if(month == 0){
            setYear(year - 1)
            setMonth(11)
        }else{
            setMonth(month - 1)
        }
    }

    // Click en día
    function clickDay(year,month,day){
        if(props.clickDia !== undefined)
            props.clickDia(year,month,day)
    }

    function mesesESP(mes){
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        return meses[mes]
    }

    return (
        <div className='calendario'>
            <div className='calendario-header' style={fila}>
                <div>
                    <button onClick={() => prevMonth()} className='calendario-btn-change'>&lt;</button>
                </div>
                <div style={{flexGrow:1, textAlign:'center'}}>
                    <h4 className="nombre_Meses">{mesesESP(month) + ' ' + year}</h4>
                </div>
                <div>
                    <button onClick={() => nextMonth()} className='calendario-btn-change'>&gt;</button>
                </div>
            </div>
            <div className='calendario-body'>
                <div className='calendario-week-header' style={fila}>
                    <div style={celdas}>Do</div>
                    <div style={celdas}>Lu</div>
                    <div style={celdas}>Ma</div>
                    <div style={celdas}>Mi</div>
                    <div style={celdas}>Ju</div>
                    <div style={celdas}>Vi</div>
                    <div style={celdas}>Sa</div>
                </div>
                {tabla.map(w =>
                    <div key={w[0]} className='calendario-week' style={fila}>
                        {w.map((d,i,a) => (d == -1)? <div key={i} style={celdas}></div> :
                            <div key={i} className='calendario-day' style={celdas}>
                                <button
                                className={(hoy == (year+'/'+month+'/'+d))?'calendario-today':''}
                                style={(fechas[d] === undefined)?{}:{borderBottom: 4 +'px solid '+fechas[d]}}
                                onClick={() => clickDay(year,month+1,d)}>
                                    {d}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )

}

const fila = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const celdas= {
    width: 14.28 + '%',
    textAlign: 'center'
}


export default Calendario