import doFetch from '../utils/doFetch'
import { baseUrl } from '../../config'
import useAuthStorage from './useAuthStorage'

const useFavourite = () => {
  const { user } = useAuthStorage()
  const authStorage = useAuthStorage()

  const createFavourite = async ( file_id ) => {  // eslint-disable-line
    const token = await authStorage.getToken()
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: JSON.stringify( { file_id } ),
    }

    try {
      return await doFetch( baseUrl + 'favourites/', options )
    } catch ( error ) {
      console.log( 'error in createFavourite hook', error )
      return false
    }
  }

  const deleteFavourite = async ( id ) => {
    const token = await authStorage.getToken()
    const options = {
      method: 'DELETE',
      headers: {
        'x-access-token': token,
      },
    }

    try {
      return await doFetch( baseUrl + 'favourites/file/' + id, options )
    } catch ( error ) {
      console.log( 'error in deleteFavourite hook', error )
      return false
    }
  }

  const getCurrentUserFavourites = async () => {
    const token = await authStorage.getToken()
    const options = {
      method: 'GET',
      headers: {
        'x-access-token': token,
      },
    }
    try {
      return await doFetch( baseUrl + 'favourites/', options )
    } catch ( error ) {
      console.log( 'error in getCurrentUserFavourites hook', error )
      return false
    }
  }

  const getMediaFavourites = async ( id ) => {
    const options = {
      method: 'GET',
    }

    try {
      let favourites = await doFetch( baseUrl + 'favourites/file/' + id,
        options )
      // favourites.isOwner = favourites.user_id === user.user_id;
      favourites = favourites.map( favourite => {
        return { ...favourite, isOwner: favourite.user_id === user.user_id }
      } )
      // console.log('f', favourites.length)
      return favourites
    } catch ( error ) {
      console.log( 'error in getMediaFavourites hook', error )
      return false
    }
  }

  return {
    createFavourite,
    deleteFavourite,
    getCurrentUserFavourites,
    getMediaFavourites,
  }
}

export default useFavourite