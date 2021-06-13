import ConvertResult from './ConvertResult'
import RatesPerDateResult from './RatesPerDateResult'
import { Table, Button } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import * as qs from 'qs'

const ResultsTable = ({ results, resultType, ratesPerDateQsParams }) => {
    return (
        <>
            <Table striped bordered hover>
                <thead>
                    {/* Display the th based on the resultType */}
                    {resultType === "ConvertResult" && <tr><th>Currency</th><th>Amount</th></tr>}
                    {resultType === "RatesPerDateResult" && <tr><th>Date</th>{results[0].rates.map((rate) => (<td key={rate.currencyName}>{rate.currencyName}</td>))}</tr>}
                </thead>
                <tbody>
                    {/* Display the Result Components based on the resultType */}
                    {resultType === "ConvertResult" && results.map((convertResult) => (
                        <ConvertResult key={uuidv4()} convertResult={convertResult} />
                    ))}
                    {resultType === "RatesPerDateResult" && results.map((ratesPerDateResult) => (
                        <RatesPerDateResult key={"RatesPerDateResult" + ratesPerDateResult.date} ratesPerDateResult={ratesPerDateResult} />
                    ))}
                </tbody>
            </Table>
            {/* Display the download button if the resultType is RatesPerDateResult */}
            {resultType === "RatesPerDateResult" &&
                <Button
                    variant="warning"
                    onClick={() => {
                        const FileDownload = require('js-file-download');

                        //Use axios to get the file from the server
                        axios.get('https://localhost:44393/api/Currencies/DownloadRatesPerPeriodExcel',
                            {
                                responseType: 'blob',//Very important- define the response type as blob, if not, the file will be corrupted
                                params: { startDate: ratesPerDateQsParams.startDate, endDate: ratesPerDateQsParams.endDate, currencies: ratesPerDateQsParams.currencies.map(c => c.value) },
                                paramsSerializer: params => {
                                    return qs.stringify(params)
                                }
                            }).then((response) => {
                                //Use FileDownload to actually download the file
                                FileDownload(response.data, 'RatesPerDate.xlsx');
                            });
                    }}
                >Download rates in excel file</Button>}
        </>
    )
}

export default ResultsTable