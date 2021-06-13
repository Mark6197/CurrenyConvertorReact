import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button } from "react-bootstrap"
import Select from 'react-select'

const ConvertForm = ({ currencies, getConvertRates }) => {
  const { handleSubmit, register, setError, clearErrors, setValue, setFocus, control, formState: { errors } } = useForm();

  useEffect(() => {
    setFocus("sourceCurrency");
  }, [setFocus]);

  const onSubmit = data => {
    getConvertRates({ ...data })
  }

  const { onChange, ...rest } = register("currencies");

  return (
    <Form className='activate-form' onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formSourceCurrency">
        <Form.Label>Convert From:</Form.Label>
        <Controller
          name="sourceCurrency"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Select currency to convert from..."
              options={currencies.map(currency => (
                { value: currency.id, label: currency.name, key: currency.id }
              ))}
            />
          )}
        />
        {errors.sourceCurrency && errors.sourceCurrency.type === "required" && <p>You must select one currency</p>}
      </Form.Group>

      <Form.Group controlId="formCurrencies">
        <Form.Label>Convert To:</Form.Label>
        <Controller
          name="currencies"
          control={control}
          rules={{ required: true, validate: { maxItems: (val) => val.length < 7 } }}
          render={() => (
            <Select
              placeholder="Select currencies to convert to..."
              closeMenuOnSelect={false}
              isMulti
              options={currencies.map(currency => (
                { value: currency.id, label: currency.name, key: currency.id }
              ))}
              onChange={(currencies) => {
                if (currencies.length > 6) {
                  setError("currencies", {
                    type: "maxItems",
                    message: "You can't select more than six currencies",
                  })
                }
                else {
                  clearErrors(["currencies"])
                }

                setValue('currencies', currencies);
              }}
              {...rest}
            />
          )}
        />
        {errors.currencies && errors.currencies.type === "required" && <p>You must select at least one currency</p>}
        {errors.currencies && errors.currencies.type === "maxItems" && <p>You can't select more than six currencies </p>}
      </Form.Group>

      <Form.Group controlId="formAmount">
        <Form.Label>Amount</Form.Label>
        <Form.Control type="number" placeholder="0" {...register('amount', { required: true, max: 999999999, min: 1 })} />
        {errors.amount && errors.amount.type === "required" && <p>Amount is required</p>}
        {errors.amount && errors.amount.type === "max" && <p>Amount value can't be larger than 999,999,999</p>}
        {errors.amount && errors.amount.type === "min" && <p>Amount value can't be less than 1</p>}
      </Form.Group>

      <Form.Group controlId="formDate">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date"
          {...register('date', {
            required: "Date is required",
            validate: {
              futureDate: (d) => new Date(d) < new Date(),
              pastDate: (d) => new Date(d) > new Date(1977, 9, 31)
            }
          }
          )} />
        {errors.date && errors.date.type === "required" && <p>{errors.date.message}</p>}
        {errors.date && errors.date.type === "futureDate" && <p>Date can't be in the future</p>}
        {errors.date && errors.date.type === "pastDate" && <p>Date must be later than 10/31/1977</p>}

      </Form.Group>

      <Button variant="primary" type="submit" block>
        Activate
      </Button>
    </Form>
  )
}

export default ConvertForm