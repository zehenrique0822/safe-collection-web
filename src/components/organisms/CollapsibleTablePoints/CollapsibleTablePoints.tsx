import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import RoomIcon from '@mui/icons-material/Room'
import moment from 'moment'
import { type IPoint } from '@/pages'
import { type SetStateAction, type Dispatch } from 'react'
import { Tooltip, type IGeolocation } from '@/components'

interface IRow {
  id: number
  parameter: string
  value: number
  date_collect: string
  over_limit: string
}

interface ITable {
  id: number
  name: string
  address: string
  latitude: number
  longitude: number
  collections: IRow[]
}

const createData = (
  points: IPoint[]
): any => {
  const filteredItems = points?.map((point) => {
    return {
      id: point.id,
      name: point.name,
      address: point.address,
      latitude: point.latitude,
      longitude: point.longitude,
      collections: point.collections.map(collection => ({
        id: collection.id,
        parameter: collection.parameter.name,
        value: collection.value,
        date_collect: moment.utc(collection.date_collect).format('DD/MM/YYYY'),
        over_limit: collection.value > collection.parameter.limit ? 'SIM' : 'NÃO'
      }))
    }
  })

  return filteredItems
}

interface Props {
  row: ITable
  setPointCenter: Dispatch<SetStateAction<IGeolocation>>
}

const Row = ({ row, setPointCenter }: Props): JSX.Element => {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => { setOpen(!open) }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{row.id}</TableCell>
        <TableCell align="center">{row.name}</TableCell>
        <TableCell align="center">{row.address}</TableCell>
        <TableCell align="center">{row.latitude}</TableCell>
        <TableCell align="center">{row.longitude}</TableCell>
        <TableCell align="center">
          <Tooltip title="Ver no mapa" >
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => { setPointCenter({ latitude: row.latitude, longitude: row.longitude }) }}
              >
              <RoomIcon/>
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" align={row.collections?.length ? 'left' : 'center'} gutterBottom component="div">
              {row.collections?.length ? 'Coletas' : 'Sem coletas para esse ponto'}
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                {row.collections?.length
                  ? <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">Parâmetro</TableCell>
                    <TableCell align="center">Valor</TableCell>
                    <TableCell align="center">Data da coleta</TableCell>
                    <TableCell align="center">Acima do limite</TableCell>
                  </TableRow>
                  : null }
                </TableHead>
                <TableBody>
                  {row.collections?.length ? row.collections.map((collection: IRow) => (
                    <TableRow key={collection.id}>
                      <TableCell align="center">{collection.id}</TableCell>
                      <TableCell align="center">{collection.parameter}</TableCell>
                      <TableCell align="center">{collection.value}</TableCell>
                      <TableCell align="center">{collection.date_collect}</TableCell>
                      <TableCell align="center">{collection.over_limit}</TableCell>
                    </TableRow>
                  )) : null}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

interface TableProps {
  points: IPoint[]
  setPointCenter: Dispatch<SetStateAction<IGeolocation>>
}

export const CollapsibleTablePoints = ({ points, setPointCenter }: TableProps): JSX.Element => {
  const rows = createData(points)

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell align="center">Nome</TableCell>
            <TableCell align="center">Endereço</TableCell>
            <TableCell align="center">Latitude</TableCell>
            <TableCell align="center">Longitude</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any) => (
            <Row key={row.id} row={row} setPointCenter={setPointCenter} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
