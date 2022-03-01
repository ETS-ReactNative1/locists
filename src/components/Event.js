import { View, Image, Text, Button } from 'react-native';
import { uploadsUrl } from '../../config';
import Attend from './Attend';
import DeleteMedia from './DeleteMedia';
import theme from '../theme';
import { Entypo } from '@expo/vector-icons';
import UserInfo from './UserInfo';

const Event = ( { eventDetails, ownProfile } ) => {
  // console.log(eventDetails)

  if ( eventDetails === null ) {
    return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
    );
  }

  // console.log('eventDetails in Event.js', eventDetails)
  // TODO: fix rendering

  return (
      <>
          {
              !ownProfile
              &&
              <View style={ { marginLeft: 15, marginVertical: 10 } }>
                  <UserInfo username={ eventDetails.description.owner }
                            avatar={ eventDetails.description.ownerAvatar }/>
              </View>
          }

        <View style={ [ theme.generalListPost, theme.event ] }>
          <View style={ theme.eventInfo }>
            <Text
                style={ theme.mediaTitle }>{ eventDetails.description.name }</Text>
            <Text>
              <Entypo name="location-pin" size={ 20 } color="black"/>
              { eventDetails.description.location }
            </Text>
            <Text>
              <Entypo name="calendar" size={ 20 } color="black"/>
              { new Date(eventDetails.description.date).toDateString() }
            </Text>
            <Text>{ eventDetails.description.price } €</Text>
            <View style={ theme.eventAttend }>
              <Entypo name="users" size={ 20 } color="black"/>
              <Text>
                50
                {
                  // {description.attendees}
                }
              </Text>

              <Button title="Attend"/>
              <Attend file_id={ eventDetails.file_id } displayIcon={ false }/>
              { eventDetails.description.isOwner &&
              <DeleteMedia file_id={ eventDetails.file_id }/> }
            </View>
          </View>
          <Image source={ { uri: uploadsUrl + eventDetails.filename } }
                 style={ theme.eventImage }/>
        </View>
      </>
  );
};

export default Event;
