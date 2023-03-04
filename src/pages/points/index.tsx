import { AppLoadingProgress, Box, Button, DataGrid, Dialog, Toast, Tooltip, Typography, type GridColDef } from '@/components'
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import { http } from '@/services'
import { IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface IPoints {
  id: number
  name: string
  address: string
  latitude: number
  longitutde: number
}

export const Points = (): JSX.Element => {
  const [points, setPoints] = useState<IPoints[]>([])
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useState<any>({ open: false })

  const getPoints = async (): Promise<void> => {
    try {
      setLoading(true)
      const { data: points } = await http.get('/points')
      setPoints(points.data)
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
      title: 'O ponto será removido!',
      message: 'Tem certeza de que deseja remover?',
      handleConfirm,
      handleCancel
    })
  }

  const handleConfirm = async (id: number): Promise<void> => {
    try {
      await http.delete(`/points/delete/${id}`)
      setPoints(prevPoints => prevPoints.filter((point) => point.id !== id))
      Toast({ message: 'Ponto removido!', type: 'success' })
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
      field: 'manager-points',
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
      width: 80
    }
  ]

  const dataGridColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', maxWidth: 100, flex: 0.5 },
    { field: 'name', headerName: 'Descrição', minWidth: 100, flex: 1 },
    { field: 'address', headerName: 'Endereço', minWidth: 100, flex: 1 },
    { field: 'latitude', headerName: 'Latitude', minWidth: 100, flex: 1 },
    { field: 'longitude', headerName: 'Longitude', minWidth: 100, flex: 1 },
    ...dataGridActions
  ]

  useEffect(() => {
    getPoints()
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
              Pontos
            </Typography>
            <Tooltip title="Adicionar" >
              <IconButton sx={{
                width: '25px',
                fontSize: '15px'
              }}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DataGrid
            columns={dataGridColumns}
            rows={points ?? []}
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
      <Dialog dialog={dialog} setDialog={setDialog} />
    </ Box>
  )
}
