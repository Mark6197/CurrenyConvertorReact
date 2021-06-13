import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'

const Header = ({ title, onConvertFormShow, onRatesPerDateFormShow, showConvertForm, showRatesPerDateForm }) => {
    return (
        <header className='header'>
            <h1>{title}</h1>
            <Button
                variant={showConvertForm ? 'danger' : 'success'}
                onClick={onConvertFormShow}
            >{showConvertForm ? 'Close' : 'Convert Currencies'}</Button>
            {<Button
                variant={showRatesPerDateForm ? 'danger' : 'success'}
                onClick={onRatesPerDateFormShow}
            >{showRatesPerDateForm ? 'Close' : 'Rates Per Date'}</Button>}
        </header>
    )
}

Header.defaultProps = {
    title: 'Currency Converter'
}

Header.propTypes = {
    title: PropTypes.string
}

export default Header
