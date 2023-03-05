import React, { type Dispatch, type SetStateAction } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Box, TextField, Toast, Map } from '@/components'
import { type IPoint } from '@/pages'
import { http } from '@/services'

interface PointFormModalProps {
  open: boolean
  onClose: () => void
  onSave: Dispatch<SetStateAction<IPoint[]>>
  point?: IPoint
}

export const PointFormModal = ({
  open,
  onClose,
  onSave,
  point
}: PointFormModalProps): JSX.Element => {
  const isUpdate = !!(point?.id)

  const initialValues = {
    id: point?.id ?? '',
    name: point?.name ?? '',
    address: point?.address ?? '',
    latitude: point?.latitude ?? '',
    longitude: point?.longitude ?? ''
  }

  const handleCreatePoint = async (values: typeof initialValues): Promise<void> => {
    try {
      const response = await http.post('/points/new', {
        name: values.name,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude
      })
      const updatedPoint: IPoint = response.data
      onSave(prevPoints => [...prevPoints, updatedPoint])
      Toast({ message: 'Ponto criado!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleUpdatePoint = async (values: typeof initialValues): Promise<void> => {
    try {
      const response = await http.put(`/points/edit/${values.id}`, {
        name: values.name,
        address: values.address,
        latitude: values.latitude,
        longitude: values.longitude
      })
      const updatedPoint: IPoint = response.data
      const updatePoint = (prevPoints: IPoint[], updatedPoint: IPoint): IPoint[] => {
        return prevPoints.map((point) =>
          point.id === updatedPoint.id ? { ...updatedPoint } : point
        )
      }
      onSave(prevPoints => updatePoint(prevPoints, updatedPoint))
      Toast({ message: 'Ponto atualizado!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleSubmit = (values: typeof initialValues): void => {
    if (isUpdate) {
      handleUpdatePoint(values)
    } else {
      handleCreatePoint(values)
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('O nome é obrigatório.')
      .min(3, 'O nome precisa ter no mínimo 3 caracteres.')
      .max(255, 'O nome precisa ter no máximo 255 caracteres.'),
    address: Yup.string()
      .required('O endereço é obrigatório.')
      .min(3, 'O endereço precisa ter no mínimo 3 caracteres.')
      .max(1000, 'O endereço precisa ter no máximo 1000 caracteres.'),
    latitude: Yup.number()
      .required('A latitude é obrigatória.'),
    longitude: Yup.number()
      .required('A longitude é obrigatória.')
  })

  const modalTitle = isUpdate ? 'Editar Ponto' : 'Adicionar Ponto'

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
                  <Field
                    margin="dense"
                    label="Nome"
                    type="text"
                    fullWidth
                    name="name"
                    as={TextField}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Field
                    margin="dense"
                    label="Endereço"
                    type="text"
                    fullWidth
                    name="address"
                    as={TextField}
                    error={touched.address && Boolean(errors.address)}
                    helperText={touched.address && errors.address}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Field
                    margin="dense"
                    label="Latitude"
                    type="number"
                    fullWidth
                    name="latitude"
                    as={TextField}
                    error={touched.latitude && Boolean(errors.latitude)}
                    helperText={touched.latitude && errors.latitude}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Field
                    margin="dense"
                    label="Longitude"
                    type="number"
                    fullWidth
                    name="longitude"
                    as={TextField}
                    error={touched.longitude && Boolean(errors.longitude)}
                    helperText={touched.longitude && errors.longitude}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Box
                    sx={{
                      height: '300px',
                      width: '300px'
                    }}
                  >
                    <Map
                      point={{ latitude: Number(values.latitude), longitude: Number(values.longitude) }}
                      label={values.name}
                      isUpdate={isUpdate}
                      onChange={setFieldValue}
                    />
                  </Box>
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
