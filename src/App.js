import { useState, useEffect } from 'react'
import Header from './components/Header'
import ConvertForm from './components/ConvertForm'
import ResultsTable from './components/ResultsTable'
import RatesPerDateForm from './components/RatesPerDateForm'
import axios from 'axios'
import './App.css'
import * as qs from 'qs'

const App = () => {
  //useState Definitions
  const [showConvertForm, setShowConvertForm] = useState(false)
  const [showRatesPerDateForm, setShowRatesPerDateForm] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [results, setResults] = useState([])
  const [notFoundMessage, setNotFoundMessage] = useState("")
  const [convertSourceCurrency, setConvertSourceCurrency] = useState("")
  const [convertDate, setConvertDate] = useState("")
  const [resultType, setResultType] = useState("")
  const [ratesPerDateQsParams, setRatesPerDateQsParams] = useState("")

  useEffect(() => {
    //Get all the currencies after the initial render
    const getCurrencies = async () => {
      const currenciesFromServer = await getCurrenciesFromServer()
      setCurrencies(currenciesFromServer)//Set the currencies to the state
    }
    getCurrencies()
  }, [])

  // Get Currencies from server using axios
  const getCurrenciesFromServer = async () => {
    const res = await axios.get('https://localhost:44393/api/Currencies')
    if (res.status === 204)
      return []
    const data = res.data
    return data
  }

  // Get Convert rates results from server using axios
  const getConvertRates = async (qsParams) => {
    const res = await axios.get('https://localhost:44393/api/Currencies/Convert',
      {
        params: { sourceCurrency: qsParams.sourceCurrency.value, currencies: qsParams.currencies.map(c => c.value), amount: qsParams.amount, date: qsParams.date },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
      })
    let data = res.data
    //If the respone is no content
    if (res.status === 204) {
      setResults([])//Set Results state to an empty array
      setResultType("")//Set ResultType state to an empty string
      setNotFoundMessage("No results found")//Set NotFoundMessage state
    }
    //If the respone is ok
    if (res.status === 200) {
      setNotFoundMessage("")//Set NotFoundMessage state to an empty string
      setResultType("ConvertResult")//Set ResultType state to "ConvertResult"
      setResults(data)//Set Results state to data recieved from the server
    }

    setConvertSourceCurrency(qsParams.sourceCurrency.label)//set ConvertSourceCurrency state to the sourceCurrency's label that was recieved in qsParams, we will use this state in the render
    setConvertDate(qsParams.date)//set ConvertDate state to the date that was recieved in qsParams, we will use this state in the render
  }

  // Get Rates per date results from server using axios
  const getRatesPerDate = async (qsParams) => {
    const res = await axios.get('https://localhost:44393/api/Currencies/RatesPerPeriod',
      {
        params: { startDate: qsParams.startDate, endDate: qsParams.endDate, currencies: qsParams.currencies.map(c => c.value) },
        paramsSerializer: params => {
          return qs.stringify(params)
        }
      })
    let data = res.data
    //If the respone is no content
    if (res.status === 204) {
      setResults([])//Set Results state to an empty array
      setNotFoundMessage("No results found")//Set NotFoundMessage state
      setResultType("")//Set ResultType state to an empty string
    }
    //If the respone is ok
    if (res.status === 200) {
      setNotFoundMessage("")//Set NotFoundMessage state to an empty string
      setResults(data)//Set Results state to data recieved from the server
      setResultType("RatesPerDateResult")//Set ResultType state to "RatesPerDateResult"
    }
  }

  return (
    <div className='container'>
      <Header
        onConvertFormShow={() => {
          setShowConvertForm(!showConvertForm)
          setShowRatesPerDateForm(false)
        }}
        onRatesPerDateFormShow={() => {
          setShowRatesPerDateForm(!showRatesPerDateForm)
          setShowConvertForm(false)
        }}
        showConvertForm={showConvertForm}
        showRatesPerDateForm={showRatesPerDateForm}
      />

      {/* Display the needed form based on the state*/}
      {showConvertForm && <ConvertForm currencies={currencies} getConvertRates={getConvertRates} />}
      {showRatesPerDateForm && <RatesPerDateForm currencies={currencies} getRatesPerDate={getRatesPerDate} setRatesPerDateQsParams={setRatesPerDateQsParams} />}
      {/* Display additional information based on the state*/}
      <h5>{convertSourceCurrency === "" ? null : "Converted from: " + convertSourceCurrency}</h5>
      <h5>{convertDate === "" ? null : "Date: " + convertDate}</h5>
      {/* Display ResultsTable if there are results*/}
      {results.length > 0 ? (
        <ResultsTable results={results} resultType={resultType} ratesPerDateQsParams={ratesPerDateQsParams} />
      ) : (notFoundMessage === "" ? null : <label>{notFoundMessage}</label>)}
    </div>
  )
}

export default App;
