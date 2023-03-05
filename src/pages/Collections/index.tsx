import { AppLoadingProgress, Box, Button, DataGrid, Dialog, CollectionFormModal, Toast, Tooltip, Typography, type GridColDef } from '@/components'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { http } from '@/services'
import { IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { type IPoint } from '../points'
import { type IParameter } from '../parameters'

export interface ICollectionResponse {
  id: number
  id_points: number
  id_parameters: number
  value: number
  date_collect: Date
}
export interface ICollection extends ICollectionResponse {
  point: string
  parameter: string
}

export const Collections = (): JSX.Element => {
  const [collections, setCollections] = useState<ICollection[]>([])
  const [points, setPoints] = useState<IPoint[]>([])
  const [parameters, setParameters] = useState<IParameter[]>([])
  const [loading, setLoading] = useState(false)
  const [dialog, setDialog] = useState<any>({ open: false })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCollection, setEditingCollection] = useState<ICollection>()

  const handleModalClose = (): void => {
    setIsModalOpen(false)
    setEditingCollection(undefined)
  }

  const handleEditCollection = (id?: number): void => {
    setIsModalOpen(true)
    if (id) {
      const collection = collections.find((collection) => collection.id === id)
      setEditingCollection(collection)
    }
  }

  const getCollections = async (): Promise<void> => {
    try {
      setLoading(true)
      const { data: points } = await http.get('/points')
      setPoints(points?.data)
      const { data: parameters } = await http.get('/parameters')
      setParameters(parameters?.data)
      const { data: collections } = await http.get('/collections')
      const formatedCollections: ICollection[] = collections?.data?.map((collection: ICollectionResponse) => {
        return {
          ...collection,
          point: points?.data?.find((point: any) => point.id === collection.id_points)?.name,
          parameter: parameters?.data?.find((parameter: any) => parameter.id === collection.id_parameters)?.name
        }
      })
      setCollections(formatedCollections)
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
      title: 'A coleta será removido!',
      message: 'Tem certeza de que deseja remover?',
      handleConfirm,
      handleCancel
    })
  }

  const handleConfirm = async (id: number): Promise<void> => {
    try {
      await http.delete(`/collections/delete/${id}`)
      setCollections(prevCollections => prevCollections.filter((collection) => collection.id !== id))
      Toast({ message: 'Coleta removido!', type: 'success' })
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
      field: 'manager-collections',
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
                onClick={() => { handleEditCollection(params?.row?.id) }}>
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
    { field: 'point', headerName: 'Ponto', minWidth: 100, flex: 1 },
    { field: 'parameter', headerName: 'Parâmetro', minWidth: 100, flex: 1 },
    { field: 'value', headerName: 'Valor', minWidth: 100, flex: 0.5 },
    { field: 'date_collect', headerName: 'Data', minWidth: 100, flex: 1, type: 'date', valueFormatter: ({ value }) => moment.utc(value).format('DD/MM/YYYY') },
    ...dataGridActions
  ]

  useEffect(() => {
    getCollections()
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
              Coletas
            </Typography>
            <Tooltip title="Adicionar" >
              <IconButton sx={{
                width: '25px',
                fontSize: '15px'
              }}
              onClick={() => {
                setEditingCollection(undefined)
                handleEditCollection()
              }}
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <DataGrid
            columns={dataGridColumns}
            rows={collections ?? []}
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
      <CollectionFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={setCollections}
        points={points}
        parameters={parameters}
        collection={editingCollection}
      />
      <Dialog dialog={dialog} setDialog={setDialog} />
    </ Box>
  )
}
