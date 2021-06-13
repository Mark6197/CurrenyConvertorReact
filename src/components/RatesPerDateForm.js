import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button } from "react-bootstrap"
import Select from 'react-select'

const RatesPerDateForm = ({ currencies, getRatesPerDate, setRatesPerDateQsParams }) => {
  const { handleSubmit, register, setError, clearErrors, getValues, setValue, setFocus, control, formState: { errors } } = useForm();

  useEffect(() => {
    setFocus("currencies");
  }, [setFocus]);

  const onSubmit = data => {
    setRatesPerDateQsParams(data)
    getRatesPerDate({ ...data })
  }

  const { onChange, ...rest } = register("currencies");

  return (
    <Form className='activate-form' onSubmit={handleSubmit(onSubmit)}>
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
              options={currencies.slice(1).map(currency => (
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

      <Form.Group controlId="formStartDate">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date"
          {...register('startDate', {
            required: "Date is required",
            validate: {
              futureDate: (d) => new Date(d) < new Date(),
              pastDate: (d) => new Date(d) > new Date(1977, 9, 31)
            }
          }
          )} />
        {errors.startDate && errors.startDate.type === "required" && <p>{errors.startDate.message}</p>}
        {errors.startDate && errors.startDate.type === "futureDate" && <p>Date can't be in the future</p>}
        {errors.startDate && errors.startDate.type === "pastDate" && <p>Date must be later than 10/31/1977</p>}
      </Form.Group>

      <Form.Group controlId="formEndDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control type="date"
          {...register('endDate', {
            required: "Date is required",
            validate: {
              futureDate: (d) => new Date(d) < new Date(),
              pastDate: (d) => new Date(d) > new Date(1977, 9, 31),
              notBeforeStartDate: (ed) => new Date(ed) > new Date(getValues(["startDate"]))
            }
          }
          )} />
        {errors.endDate && errors.endDate.type === "required" && <p>{errors.endDate.message}</p>}
        {errors.endDate && errors.endDate.type === "futureDate" && <p>Date can't be in the future</p>}
        {errors.endDate && errors.endDate.type === "pastDate" && <p>Date must be later than 10/31/1977</p>}
        {errors.endDate && errors.endDate.type === "notBeforeStartDate" && <p>End date must be later than start date</p>}
      </Form.Group>

      <Button variant="primary" type="submit" block>
        Activate
      </Button>
    </Form>
  )
}

export default RatesPerDateForm