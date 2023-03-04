import { Box, Button, Card, CardActions, CardContent, Typography } from '@/components'
import Lottie from 'lottie-react'
import { Link } from 'react-router-dom'

interface Props {
  name: string
  path: string
  description: string
  lottie: any
}

export const MenuCard = ({ name, path, description, lottie }: Props): JSX.Element => {
  return (
    <Card sx={{
      width: 300,
      height: 315,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '5px',
      margin: '5px',
      boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
    }}>
      <Box sx={{
        width: 140,
        height: 140,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Lottie animationData={lottie} loop={true} />
      </Box>
      <CardContent>
        <Typography gutterBottom variant="h5">
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Link style={{ textDecoration: 'none' }} to={path}>
          <Button size="medium" variant="contained">Ver Mais</Button>
        </Link>
      </CardActions>
    </Card>
  )
}
