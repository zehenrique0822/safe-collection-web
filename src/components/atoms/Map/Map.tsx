import { Box } from '@/components'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import marker from '@/assets/icons/marker.png'
export interface IGeolocation {
  latitude: number
  longitude: number
}

interface Props {
  point: IGeolocation
  label: string
  isUpdate: boolean
  onChange: (field: string, value: number) => void
}

export const Map = ({ point, label, isUpdate, onChange }: Props): JSX.Element => {
  const position = {
    lat: point.latitude || -23.555323,
    lng: point.longitude || -46.642830
  }

  if (!isUpdate && !point.latitude && !point.longitude) {
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange('latitude', Number(pos.coords.latitude))
      onChange('longitude', Number(pos.coords.longitude))
    })
  }

  const token = String(import.meta.env.REACT_APP_GOOGLEMAPS)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: token
  })

  return (
    <Box
      sx={{
        height: '300px',
        '.map-marker': {
          marginTop: '-40px',
          fontWeight: '700'
        }
      }}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={position}
          zoom={15}
        >
          <Marker
            position={position}
            icon={{
              url: marker,
              scaledSize: new window.google.maps.Size(40, 40)
            }}
            draggable
            onDragEnd={(e) => {
              onChange('latitude', Number(e.latLng?.lat()))
              onChange('longitude', Number(e.latLng?.lng()))
            }}
            options={{
              label: {
                text: label || 'Digite o nome do ponto',
                className: 'map-marker'
              }
            }} />
        </GoogleMap>
      ) : <></>}
    </Box>
  )
}
