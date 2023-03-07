import { AppLoadingProgress, Box, Button, CollapsibleTablePoints, type IGeolocation, PointsListMap, Typography } from '@/components'
import { http } from '@/services'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { type IPoint } from '../points'

export const MapPoints = (): JSX.Element => {
  const [points, setPoints] = useState<IPoint[]>([])
  const [pointCenter, setPointCenter] = useState<IGeolocation>({} as IGeolocation)
  const [loading, setLoading] = useState<boolean>(false)

  const getPoints = async (): Promise<void> => {
    try {
      setLoading(true)
      const { data: points } = await http.get('/points')
      setPoints(points.data)
      setPointCenter({ latitude: points.data[0].latitude, longitude: points.data[0].longitude })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

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
        justifyContent: 'center'
      }} >
      <Typography
        sx={{
          color: '#DD5E0F',
          fontWeight: 600,
          textShadow: '1px 1px 1px #121211'
        }}
        align="center"
        gutterBottom variant="h2">
        Mapa de pontos
      </Typography>
      {!points?.length
        ? <Typography
      align="center"
      gutterBottom variant="h5">
        Cadastre seus pontos para visualizar o mapa e listagem de pontos
      </Typography>
        : <>
      <Box
        sx={{
          height: '500px',
          width: '1000px',
          '@media (max-width: 768px)': {
            width: '100%',
            flexDirection: 'column'
          },
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          marginBottom: '20px',
          justifyContent: 'space-between'
        }}
      >
        <PointsListMap points={points} pointCenter={pointCenter} />
      </ Box>
      <Box
        sx={{
          width: '1000px',
          '@media (max-width: 768px)': {
            width: '100%'
          }
        }}
      >
        <Typography
        align="center"
        gutterBottom variant="h5">
          Listagem de pontos e seus parâmetros
        </Typography>
        <CollapsibleTablePoints points={points} setPointCenter={setPointCenter} />
      </Box>
      </>
      }
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
    </ Box>
  )
}
