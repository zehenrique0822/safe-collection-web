import { Box, type IGeolocation } from '@/components'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import marker from '@/assets/icons/marker.png'
import markerOverLimit from '@/assets/icons/marker-over-limit.png'
import { type IPoint } from '@/pages'

interface Props {
  points: IPoint[]
  pointCenter: IGeolocation
}

export const PointsListMap = ({ points, pointCenter }: Props): JSX.Element => {
  const token = String(import.meta.env.REACT_APP_GOOGLEMAPS)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: token
  })

  return (
    <Box
      sx={{
        height: '100%',
        '.map-marker': {
          marginTop: '-40px',
          fontWeight: '700'
        }
      }}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={ {
            lat: pointCenter.latitude,
            lng: pointCenter.longitude
          }}
          zoom={15}
        >
          {points.map((point) => (
            <Marker
              key={point.id}
              position={{
                lat: point.latitude,
                lng: point.longitude
              }}
              icon={{
                url: point.collections?.find((col) => col.value > col.parameter.limit) ? markerOverLimit : marker,
                scaledSize: new window.google.maps.Size(40, 40)
              }}
              options={{
                label: {
                  text: point.name,
                  className: 'map-marker'
                }
              }}
            />
          ))}
        </GoogleMap>
      ) : <></>}
    </Box>
  )
}
