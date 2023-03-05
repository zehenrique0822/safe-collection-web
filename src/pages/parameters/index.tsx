import { AppLoadingProgress, Box, Button, DataGrid, Dialog, ParameterFormModal, Toast, Tooltip, Typography, type GridColDef } from '@/components'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { http } from '@/services'
import { IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export interface IParameter {
  id: number
  name: string
  unit: string
  limit: number
}

export const Parameters = (): JSX.Element => {
  const [parameters, setParameters] = useState<IParameter[]>([])
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useState<any>({ open: false })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingParameter, setEditingParameter] = useState<IParameter>()

  const handleModalClose = (): void => {
    setIsModalOpen(false)
    setEditingParameter(undefined)
  }

  const handleEditParameter = (id?: number): void => {
    setIsModalOpen(true)
    if (id) {
      const parameter = parameters.find((parameter) => parameter.id === id)
      setEditingParameter(parameter)
    }
  }

  const getParameters = async (): Promise<void> => {
    try {
      setLoading(true)
      const { data: parameters } = await http.get('/parameters')
      setParameters(parameters.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (id: number): void => {
    setDialog({
      ...dialog,
      id,
      open: true,
      title: 'O parâmetro será removido!',
      message: 'Tem certeza de que deseja remover?',
      handleConfirm,
      handleCancel
    })
  }

  const handleConfirm = async (id: number): Promise<void> => {
    try {
      await http.delete(`/parameters/delete/${id}`)
      setParameters(prevParameters => prevParameters.filter((parameter) => parameter.id !== id))
      Toast({ message: 'Parâmetro removido!', type: 'success' })
    } catch (error: any) {
      const message = error?.response?.data.error ?? 'Erro, tente novamante!'
      Toast({ message, type: 'error' })
    }
  }

  const handleCancel = async (): Promise<void> => {
    setDialog({
      ...dialog,
      open: false
    })
  }

  const dataGridActions: GridColDef[] = [
    {
      field: 'manager-parameters',
      type: 'actions',
      sortable: false,
      headerName: '',
      renderCell: (params: any) => {
        return (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 0.5
            }}
          >
            <Tooltip title="Editar" >
              <IconButton sx={{
                width: '20px',
                fontSize: '10px'
              }}
                onClick={() => { handleEditParameter(params?.row?.id) }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Remover" >
              <IconButton sx={{
                width: '20px',
                fontSize: '10px'
              }}
                onClick={() => { handleOpenDialog(params?.row?.id) }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
      align: 'right',
      width: 100
    }
  ]

  const dataGridColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', maxWidth: 100, flex: 0.5 },
    { field: 'name', headerName: 'Descrição', minWidth: 100, flex: 1 },
    { field: 'unit', headerName: 'Unidade M.', minWidth: 100, flex: 1 },
    { field: 'limit', headerName: 'Limite', minWidth: 100, flex: 1 },
    ...dataGridActions
  ]

  useEffect(() => {
    getParameters()
  }, [])

  if (loading) return <AppLoadingProgress />

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        overflowY: 'hidden'
      }} >
      <Box
        sx={{
          height: '80%',
          width: '1000px',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            width: '95%'
          },
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          marginBottom: '20px',
          justifyContent: 'space-between'
        }}
      >
        <Box p={3}
          flex={1}
          sx={{
            padding: '35px 24px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            borderRadius: '10px',
            '& > div:nth-child(2)': {
              height: '88%'
            }
          }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography
              sx={{
                color: '#DD5E0F',
                fontWeight: 600,
                textShadow: '1px 1px 1px #121211'
              }}
              gutterBottom variant="h2">
              Parâmetros
            </Typography>
            <Tooltip title="Adicionar" >
              <IconButton sx={{
                width: '25px',
                fontSize: '15px'
              }}
              onClick={() => {
                setEditingParameter(undefined)
                handleEditParameter()
              }}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DataGrid
            columns={dataGridColumns}
            rows={parameters ?? []}
          />
        </Box>
      </Box>
      <Link style={{ textDecoration: 'none' }} to="/">
        <Button
          sx={{
            marginTop: '10px',
            maxWidth: '200px'
          }}
          type="button"
          variant="contained"
        >
          VOLTAR
        </Button>
      </Link>
      <ParameterFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={setParameters}
        parameter={editingParameter}
      />
      <Dialog dialog={dialog} setDialog={setDialog} />
    </ Box>
  )
}
