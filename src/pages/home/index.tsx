import { Box, MenuCard, Typography } from '@/components'
import lottiePoint from '../../assets/lotties/point.json'
import lottieParameters from '../../assets/lotties/parameters.json'
import lottieMapCollections from '../../assets/lotties/map-collections.json'
import lottieCollections from '../../assets/lotties/collections.json'

export const Home = (): JSX.Element => {
  const menuOptions = [
    {
      name: 'Pontos de coleta',
      description: 'Listagem, edição e remoção de pontos de coleta',
      lottie: lottiePoint,
      path: '/points'
    },
    {
      name: 'Parâmetros',
      description: 'Listagem, edição e remoção de parâmetros',
      lottie: lottieParameters,
      path: '/parameters'
    },
    {
      name: 'Coletas',
      description: 'Listagem, edição e remoção coletas',
      lottie: lottieCollections,
      path: '/collections'
    },
    {
      name: 'Listar todos',
      description: 'Listagem de todos pontos e seus parâmetros',
      lottie: lottieMapCollections,
      path: '/map-points'
    }
  ]

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <Typography
        sx={{
          color: '#DD5E0F',
          fontWeight: 600,
          textShadow: '1px 1px 1px #121211'
        }}
        gutterBottom variant="h2">
        Coleta Segura
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          width: '700px',
          justifyContent: 'center',
          '@media (max-width: 768px)': {
            width: '100%',
            '> div': {
              marginBottom: '20px'
            }
          }
        }}
      >
        {menuOptions.map((menu) => (
          <MenuCard
            key={menu.name}
            name={menu.name}
            description={menu.description}
            lottie={menu.lottie}
            path={menu.path}
          />
        ))}
      </Box>
    </Box>
  )
}
