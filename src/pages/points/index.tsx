import { AppLoadingProgress, Box, Button, DataGrid, type GridColDef } from '@/components'
import { http } from '@/services'
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

  const dataGridActions: GridColDef[] = [
    {
      field: 'manager-leves',
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
            <Button
              sx={{
                width: '20px',
                fontSize: '10px'
              }}
              variant="contained"
              size="small"
              onClick={() => { console.log(params?.row) }}
            >
              Remover
            </Button>
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
          height: '669px',
          width: '700px',
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            width: '95%'
          },
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
      >
        <Box p={3}
          flex={1}
          sx={{
            padding: '0 24px',
            boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
            borderRadius: '10px'
          }}>
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
        </Button></Link>
    </ Box>
  )
}
