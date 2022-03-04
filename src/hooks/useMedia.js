import { useState } from 'react'
import axios from 'axios'
import doFetch from '../utils/doFetch'
import { baseUrl, eventTag, postTag } from '../../config'
import useAuthStorage from './useAuthStorage'
import fetchAvatar from '../utils/fetchAvatar'
import sortLatest from '../utils/sortLatest'
import useComment from './useComment'
import useFavourite from './useFavourite'

const useMedia = () => {
  // TODO: get token here, not in views, fix
  const { user } = useAuthStorage()
  const [ loading, setLoading ] = useState( false )
  const [ events, setEvents ] = useState()
  const [ posts, setPosts ] = useState()
  const [ singleMedia, setSingleMedia ] = useState()
  const [ allMedia, setAllMedia ] = useState()
  const [ userMedia, setUserMedia ] = useState()

  const { getMediaComments } = useComment()
  const { getMediaFavourites } = useFavourite()

  const getAllMedia = async ( filter = null ) => {

    console.log( 'filter in getAllMedia hook:', filter )


    /*
     * inorder to get thumbnails for optimization
     * get all ids and fetch files
     * */

    const events = await getEventsWithThumbnails()
    const posts = await getPostsWithThumbnails()

    const mixed = [ ...events, ...posts ]

    switch ( filter ) {

      case 'latest':
        return sortLatest( mixed )
      case 'postsFirst':
        return [ ...posts, ...events ]
      default:
        // return mixed.sort( () => Math.random() - 0.5 )
        return mixed
    }

  }

  const getEventsWithThumbnails = async () => {
    setLoading( true )
    const eventArr = []
    const idEvents = await getEvents().
      then( events => events.map( event => event.file_id ) )
    for ( let i = 0; i < idEvents.length; i++ ) {
      let event = await getMediaById( idEvents[ i ], true ) // eslint-disable-line
      event.description.isOwner = ( event.user_id === user.user_id )

      // Set owner avatar url
      event.description.ownerAvatar = await fetchAvatar( event.user_id )

      // Set comments count for sorting
      event.description.commentsCount = await getMediaComments( event.file_id ).
        then( e => e.length )

      // Set attendees count for sorting
      event.description.attendeesCount = await getMediaFavourites( event.file_id ).
        then( favs => favs.length )

      // Set internal id for list opt
      event.eventId = i + 1

      eventArr.push( event )
    }
    setEvents( eventArr )
    setLoading( false )
    return eventArr
  }

  const getPostsWithThumbnails = async () => {
    setLoading( true )
    const postArr = []
    const idPosts = await getPosts().
      then( posts => posts.map( post => post.file_id ) )
    for ( let i = 0; i < idPosts.length; i++ ) {
      let post = await getMediaById( idPosts[ i ], true ) // eslint-disable-line
      post.description.isOwner = ( post.user_id === user.user_id )

      // Set owner avatar url
      post.description.ownerAvatar = await fetchAvatar( post.user_id )

      // Set comments count for sorting
      post.description.commentsCount = await getMediaComments( post.file_id ).
        then( e => e.length )

      // Set attendees count for sorting
      post.description.likesCount = await getMediaFavourites( post.file_id ).
        then( likes => likes.length )

      // Set internal id for list opt
      post.postId = i + 1

      postArr.push( post )
    }
    setPosts( postArr )
    setLoading( false )
    // console.log('PPP', postArr)
    return postArr
  }

  const getEvents = async () => {
    const URL = `${ baseUrl }tags/${ eventTag }`
    try {
      const events = await axios.get( URL )
      setEvents( events.data )
      return events.data
    } catch ( e ) {
      console.log( e )
    }
  }

  const getPosts = async () => {
    const URL = `${ baseUrl }tags/${ postTag }`
    try {
      const posts = await axios.get( URL )
      setPosts( posts.data )
      return posts.data
    } catch ( e ) {
      console.log( e )
    }
  }

  const getMediaById = async ( mediaId, returnObject = false ) => {
    const URL = `${ baseUrl }media/${ mediaId }`
    try {
      // setLoading( true );
      const { data } = await axios.get( URL )
      if ( data ) {
        data.description = JSON.parse( data.description );
        data.description.ownerAvatar = await fetchAvatar( data.user_id );
        if ( returnObject ) {
          // setLoading( false );
          return data
        } else {
          setSingleMedia( data )
          // setLoading( false );
        }
      }
    } catch ( e ) {
      console.log( e )
      setLoading( false )
    }
  }

  const getUserMedia = async ( token ) => {
    const userMediaPE = []
    const URL = `${ baseUrl }media/user`
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    }
    try {
      const data = await doFetch( URL, options )
      if ( data ) {
        console.log( data.length )
        for ( let i = 0; i < data.length; i++ ) {
          data[ i ].description = JSON.parse( data[ i ].description )
          const type = data[ i ].description.mediaType;
          ( type === 'event' || type === 'post' ) &&
          userMediaPE.push( data[ i ] )
        }
      }
      setUserMedia( userMediaPE )
    } catch ( e ) {
      console.log( 'Error in getting user files', e.message )
    }
  }

  // TODO: get token here in the hook
  const uploadMedia = async ( formData, token ) => {
    console.log( 'token', token )
    const options = {
      method: 'POST',
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    }

    try {
      // setLoading(true);
      const result = await doFetch( baseUrl + 'media', options )
      // console.log('url', baseUrl)
      // result && setLoading(false);
      return result
    } catch ( e ) {
      console.log( 'error in uploadMedia hook', e.message )
      return false
    }

  }

  const deleteMedia = async ( id ) => {
    console.log( 'DELETE' )
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': user.token,
      },
    }

    try {
      const result = await doFetch( baseUrl + 'media/' + id, options )
      console.log( 'delete res in hook', result )
      return result
    } catch ( e ) {
      console.log( 'error in deleteMedia hook', e.message )
      return e.message
    }

  }

  return {
    getEvents,
    getPosts,
    getMediaById,
    getAllMedia,
    getUserMedia,
    uploadMedia,
    getEventsWithThumbnails,
    getPostsWithThumbnails,
    deleteMedia,
    events,
    posts,
    allMedia,
    singleMedia,
    userMedia,
    // loadingEvents,
    // loadingPosts,
    // loadingSingleMedia,
    loading,
    setLoading,
    setAllMedia,
    // loadingMediaUpload,
  }

}

export default useMedia