import { View, Image, Text } from 'react-native'
import { uploadsUrl } from '../../config'
import Attend from './Attend'
import DeleteMedia from './DeleteMedia'
import theme from '../theme'
import { Entypo } from '@expo/vector-icons'
import UserInfo from './UserInfo'

import Location from '../../assets/icons/Location.svg'
import Loading from './Loading'
import React from 'react'
import PropTypes from 'prop-types'

const Event = ( { eventDetails, ownProfile } ) => {
  // console.log('Event.js', eventDetails)

  if ( eventDetails === null ) return <Loading />

  const hasThumbnails = ( eventDetails.thumbnails !== undefined )

  return (
    <>
      {
        !ownProfile
        &&
        <View style={ { marginLeft: 10, marginVertical: 3 } }>
          <UserInfo username={ eventDetails.description.owner }
                    timeAdded={eventDetails.time_added}
                    avatar={ eventDetails.description.ownerAvatar } />
        </View>
      }

      <View style={ [ theme.generalListPost, theme.event ] }>
        <View style={ theme.eventInfo }>
          <Text
            style={ theme.mediaTitle }>{ eventDetails.description.name }</Text>
          <Text>
            <Location width={ 20 } height={ 20 } />
            { eventDetails.description.location }
          </Text>
          <View style={ { paddingLeft: 5 } }>
            <Text>
              { new Date( eventDetails.description.date ).toDateString() }
            </Text>
            <Text>{ eventDetails.description.price } €</Text>
          </View>
          <View style={ theme.eventAttend }>
            <Entypo name='users' size={ 20 } color='black' />

            <Attend file_id={ eventDetails.file_id } displayIcon={ false } />
            { eventDetails.description.isOwner &&
            <DeleteMedia file_id={ eventDetails.file_id } /> }
          </View>
        </View>
        <Image source={ { uri: hasThumbnails ? (uploadsUrl + eventDetails.thumbnails.w160) : (uploadsUrl + eventDetails.filename)} }
               style={ theme.eventImage } />
      </View>
    </>
  )
}

Event.propTypes = {
  eventDetails: PropTypes.object,
  ownProfile: PropTypes.bool,
}

export default Event
