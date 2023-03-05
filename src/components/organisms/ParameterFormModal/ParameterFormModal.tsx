import React, { type Dispatch, type SetStateAction } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material'
import { Box, TextField, Toast } from '@/components'
import { type IParameter } from '@/pages'
import { http } from '@/services'

interface ParameterFormModalProps {
  open: boolean
  onClose: () => void
  onSave: Dispatch<SetStateAction<IParameter[]>>
  parameter?: IParameter
}

export const ParameterFormModal = ({
  open,
  onClose,
  onSave,
  parameter
}: ParameterFormModalProps): JSX.Element => {
  const isUpdate = !!(parameter?.id)

  const initialValues = {
    id: parameter?.id ?? '',
    name: parameter?.name ?? '',
    unit: parameter?.unit ?? '',
    limit: parameter?.limit ?? ''
  }

  const handleCreateParameter = async (values: typeof initialValues): Promise<void> => {
    try {
      const response = await http.post('/parameters/new', {
        name: values.name,
        unit: values.unit,
        limit: values.limit
      })
      const updatedParameter: IParameter = response.data
      onSave(prevParameters => [...prevParameters, updatedParameter])
      Toast({ message: 'Parâmetro criado!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleUpdateParameter = async (values: typeof initialValues): Promise<void> => {
    try {
      const response = await http.put(`/parameters/edit/${values.id}`, {
        name: values.name,
        unit: values.unit,
        limit: values.limit
      })
      const updatedParameter: IParameter = response.data
      const updateParameter = (prevParameters: IParameter[], updatedParameter: IParameter): IParameter[] => {
        return prevParameters.map((parameter) =>
          parameter.id === updatedParameter.id ? { ...updatedParameter } : parameter
        )
      }
      onSave(prevParameters => updateParameter(prevParameters, updatedParameter))
      Toast({ message: 'Parâmetro atualizado!', type: 'success' })
      onClose()
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleSubmit = (values: typeof initialValues): void => {
    if (isUpdate) {
      handleUpdateParameter(values)
    } else {
      handleCreateParameter(values)
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('O nome é obrigatório.')
      .min(3, 'O nome precisa ter no mínimo 3 caracteres.')
      .max(255, 'O nome precisa ter no máximo 255 caracteres.'),
    unit: Yup.string()
      .required('A unidade de medida é obrigatório.')
      .min(3, 'A unidade de medida precisa ter no mínimo 3 caracteres.')
      .max(255, 'A unidade de medida precisa ter no máximo 255 caracteres.'),
    limit: Yup.number()
      .required('O limite é obrigatório.')
  })

  const modalTitle = isUpdate ? 'Editar Parâmetro' : 'Adicionar Parâmetro'

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
            {({ errors, touched }) => (
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
                    label="Unidade M."
                    type="text"
                    fullWidth
                    name="unit"
                    as={TextField}
                    error={touched.unit && Boolean(errors.unit)}
                    helperText={touched.unit && errors.unit}
                    sx={{
                      width: '400px',
                      '@media (max-width: 768px)': {
                        width: '300px'
                      }
                    }}
                  />
                  <Field
                    margin="dense"
                    label="Limite"
                    type="number"
                    fullWidth
                    name="limit"
                    as={TextField}
                    error={touched.limit && Boolean(errors.limit)}
                    helperText={touched.limit && errors.limit}
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
