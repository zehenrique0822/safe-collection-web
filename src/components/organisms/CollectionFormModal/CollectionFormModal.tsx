import React, { type Dispatch, type SetStateAction } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Box, TextField, Toast } from '@/components'
import { type IParameter, type IPoint, type ICollection } from '@/pages'
import { http } from '@/services'
import moment from 'moment'

interface CollectionFormModalProps {
  open: boolean
  onClose: () => void
  onSave: Dispatch<SetStateAction<ICollection[]>>
  points: IPoint[]
  parameters: IParameter[]
  collection?: ICollection
}

export const CollectionFormModal = ({
  open,
  onClose,
  onSave,
  points,
  parameters,
  collection
}: CollectionFormModalProps): JSX.Element => {
  const isUpdate = !!(collection?.id)

  const pointsOptions = points?.map((point: IPoint) => {
    return {
      value: point.id,
      label: point.name
    }
  })

  const parametersOptions = parameters?.map((param: IParameter) => {
    return {
      value: param.id,
      label: param.name
    }
  })

  const initialValues = {
    id: collection?.id ?? '',
    id_points: collection?.id_points ?? '',
    id_parameters: collection?.id_parameters ?? '',
    value: collection?.value ?? '',
    date_collect: collection?.date_collect ?? ''
  }

  const handleCreateCollection = async (values: typeof initialValues): Promise<void> => {
    console.log(values)
    try {
      const response = await http.post('/collections/new', {
        id_points: values?.id_points,
        id_parameters: values?.id_parameters,
        value: values?.value,
        date_collect: values?.date_collect
      })
      const updatedCollection: ICollection = response.data
      const point = points?.find((point: any) => point.id === updatedCollection.id_points)?.name
      const parameter = parameters?.find((param: any) => param.id === updatedCollection.id_parameters)?.name
      if (point) updatedCollection.point = point
      if (parameter) updatedCollection.parameter = parameter
      onSave(prevCollections => [...prevCollections, updatedCollection])
      Toast({ message: 'Coleta registrada!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleUpdateCollection = async (values: typeof initialValues): Promise<void> => {
    try {
      const response = await http.put(`/collections/edit/${values.id}`, {
        id_points: values?.id_points,
        id_parameters: values?.id_parameters,
        value: values?.value,
        date_collect: values?.date_collect
      })
      const updatedCollection: ICollection = response.data
      const point = points?.find((point: any) => point.id === updatedCollection.id_points)?.name
      const parameter = parameters?.find((param: any) => param.id === updatedCollection.id_parameters)?.name
      if (point) updatedCollection.point = point
      if (parameter) updatedCollection.parameter = parameter
      const updateCollection = (prevCollections: ICollection[], updatedCollection: ICollection): ICollection[] => {
        return prevCollections.map((collection) =>
          collection.id === updatedCollection.id ? { ...updatedCollection } : collection
        )
      }
      onSave(prevCollections => updateCollection(prevCollections, updatedCollection))
      Toast({ message: 'Coleta atualizada!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleSubmit = (values: typeof initialValues): void => {
    if (isUpdate) {
      handleUpdateCollection(values)
    } else {
      handleCreateCollection(values)
    }
  }

  const validationSchema = Yup.object({
    id_points: Yup.number()
      .required('O Ponto é obrigatório.'),
    id_parameters: Yup.number()
      .required('O Parâmetro é obrigatório.'),
    value: Yup.number()
      .required('O valor é obrigatório.'),
    date_collect: Yup.date()
      .max(new Date(), 'A data de coleta não pode ser maior que hoje')
      .required('A data de coleta é obrigatória.')
  })

  const modalTitle = isUpdate ? 'Editar Coleta' : 'Adicionar Coleta'

  return (
    <Dialog key={isUpdate ? 'edit' : 'add'} open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <FormControl
                    sx={{ marginTop: '5px' }}>
                    <InputLabel id="points-label">Pontos</InputLabel>
                    <Select
                      labelId="points-label"
                      id="points-select"
                      label="Pontos"
                      name="point"
                      value={values.id_points}
                      onChange={(e) => { setFieldValue('id_points', e.target.value) }}
                      error={touched.id_points && Boolean(errors.id_points)}
                      sx={{
                        width: '400px',
                        color: '#000000',
                        '@media (max-width: 768px)': {
                          width: '300px'
                        }
                      }}
                    >
                      {pointsOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>))}
                    </Select>
                  </FormControl>
                  <FormControl
                    sx={{ marginTop: '5px' }}>
                    <InputLabel id="parameters-label">Parâmetros</InputLabel>
                    <Select
                      labelId="parameters-label"
                      id="parameters-select"
                      label="Parâmetros"
                      name="parameter"
                      value={values.id_parameters}
                      onChange={(e) => { setFieldValue('id_parameters', e.target.value) }}
                      error={touched.id_parameters && Boolean(errors.id_parameters)}
                      sx={{
                        width: '400px',
                        color: '#000000',
                        '@media (max-width: 768px)': {
                          width: '300px'
                        }
                      }}
                    >
                      {parametersOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>))}
                    </Select>
                  </FormControl>
                  <Field
                    margin="dense"
                    label="Valor"
                    type="number"
                    fullWidth
                    name="value"
                    as={TextField}
                    error={touched.value && Boolean(errors.value)}
                    helperText={touched.value && errors.value}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Field
                    margin="dense"
                    label="Data"
                    type="date"
                    fullWidth
                    name="date_collect"
                    as={TextField}
                    value={moment.utc(values.date_collect).format('YYYY-MM-DD')}
                    InputLabelProps={{ shrink: true }}
                    error={touched.date_collect && Boolean(errors.date_collect)}
                    helperText={touched.date_collect && errors.date_collect}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-evenly',
                      marginTop: '20px',
                      width: '100%'
                    }}
                  >
                    <Button
                      sx={{
                        width: '120px'
                      }}
                      onClick={onClose}
                      type="button"
                      color="error"
                      variant="contained"
                    >
                      Cancelar
                    </Button>
                    <Button
                      sx={{
                        width: '120px'
                      }}
                      size="medium"
                      variant="contained"
                      type="submit"
                    >
                      Salvar
                    </Button>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  )
}
