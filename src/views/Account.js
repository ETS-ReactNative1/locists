import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Image,
  FlatList,
} from 'react-native'
import useAuthStorage from '../hooks/useAuthStorage'
import theme from '../theme'
import useComment from '../hooks/useComment'
import useMedia from '../hooks/useMedia'
import Post from '../components/Post'
import Event from '../components/Event'
import PropTypes from 'prop-types'
import Loading from '../components/Loading'

const Account = ( { navigation } ) => {
  console.log( 'Account.js' )

  const { user } = useAuthStorage()
  const { getCurrentUserComments } = useComment()
  const [ comments, setComments ] = useState( [] )
  const { getUserMedia, userMedia } = useMedia()
  const [ loading, setLoading ] = useState( false )

  /* const getMediaForUser = useMemo( async () => {
   getCurrentUserComments().then( comments => setComments( comments ) )
   await getUserMedia( user.token )
   }, [] ) */

  /*  If user is logged in
   *   Hide Authentication view and move to Account view
   * */

  useEffect( async () => {
    console.log( 'Account.js useEffect' )
    setLoading( true )
    getCurrentUserComments().then( comments => setComments( comments ) )
    await getUserMedia()
    setLoading( false )

    return navigation.addListener( 'focus', async () => {
      console.log( 'Account.js focus' )
      setLoading( true )
      getCurrentUserComments().then( comments => setComments( comments ) )
      await getUserMedia( user.token )
      setLoading( false )
    } )
  }, [] )

  const EmptyListMessage = () => <Text style={ { color: '#fff' } }>You Have not
    posted anything yet</Text>

  if ( loading ) return <Loading />

  return (
    <>
      <View style={ { alignItems: 'center', height: '90%' } }>

        <View style={ { marginBottom: 10 } }>
          { user.avatar ?
            <Image
              source={ { uri: user.avatar } }
              style={ { width: 150, height: 150, borderRadius: 75 } }
              // style={ theme.profilePic }
            />
            :
            <Image
              source={ require( '../../assets/defaultPic.jpg' ) }
              style={ { width: 150, height: 150, borderRadius: 75 } }
              // style={ theme.profilePic }
            />
          }
        </View>

        <View style={ { alignItems: 'center', marginBottom: 10 } }>
          <Text style={ {
            color: '#fff',
            marginVertical: 5,
          } }>Hello { user.username }, you are { user.isLogged &&
          'logged in' }</Text>
          <Text style={ { color: '#fff' } }>You have posted { comments.length >
          0
            ? comments.length
            : 0 } comments and { userMedia &&
          userMedia.length } events/posts</Text>
        </View>
        <FlatList
          data={ userMedia }
          ListEmptyComponent={ EmptyListMessage }
          keyExtractor={ ( item ) => item.file_id }
          renderItem={ ( { item } ) => {
            return (
              item.description.mediaType === 'post' ?
                <Post postMedia={ item } ownProfile={ true } />
                :
                <Event eventDetails={ item } ownProfile={ true } />
            )
          }
          }
        />
      </View>
    </>
  )
}

Account.propTypes = {
  navigation: PropTypes.object,
}

export default Account
