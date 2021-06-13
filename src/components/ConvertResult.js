
const ConvertResult = ({ convertResult }) => {
  return (
    <tr>
      <td>{convertResult.currencyName}</td>
      <td>{convertResult.amount != null ? convertResult.amount : "No Records Found"}</td>
    </tr>
  )
}

export default ConvertResult