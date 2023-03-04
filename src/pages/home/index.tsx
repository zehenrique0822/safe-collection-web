import { Box } from '@/components'
import { Link } from 'react-router-dom'

export const Home = (): JSX.Element => {
  return (
    <Box>
      <Link to="/">
        <p>Home</p>
      </Link>
    </Box>
  )
}
