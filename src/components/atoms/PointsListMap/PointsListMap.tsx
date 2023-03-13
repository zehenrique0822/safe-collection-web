import { Box, type IGeolocation } from '@/components'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'
import marker from '@/assets/icons/marker.png'
import markerOverLimit from '@/assets/icons/marker-over-limit.png'
import { type IPoint } from '@/pages'
import { useEffect, useState } from 'react'

interface Props {
  points: IPoint[]
  pointCenter: IGeolocation
}

export const PointsListMap = ({ points, pointCenter }: Props): JSX.Element => {
  const [map, setMap] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const onLoad = (map: any): void => {
    setMap(map)
  }

  const onIdle = (): void => {
    setIsMapLoaded(true)
  }

  const token = String(import.meta.env.REACT_APP_GOOGLEMAPS)
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: token
  })

  useEffect(() => {
    if (isMapLoaded) {
      points.forEach((point) => {
        const markers = new window.google.maps.Marker({
          position: {
            lat: point.latitude,
            lng: point.longitude
          },
          map,
          icon: {
            url: point.collections?.find((col) => col.value > col.parameter.limit) ? markerOverLimit : marker,
            scaledSize: new window.google.maps.Size(40, 40)
          },
          label: {
            text: point.name,
            className: 'map-marker'
          }
        })
      })
    }
  }, [isMapLoaded])

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
          onLoad={onLoad}
          onIdle={onIdle}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={{
            lat: pointCenter.latitude,
            lng: pointCenter.longitude
          }}
          zoom={15}
        >
        </GoogleMap>
      ) : <></>}
    </Box>
  )
}
