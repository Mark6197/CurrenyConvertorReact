
const RatesPerDateResult = ({ ratesPerDateResult }) => {
  return (
    <tr>
      <td>{ratesPerDateResult.date}</td>
      {ratesPerDateResult.rates.map((rate) => <td key={rate.currencyName + ratesPerDateResult.date}>{rate.amount === null ? "-----" : rate.amount}</td>)}
    </tr>
  )
}

export default RatesPerDateResult