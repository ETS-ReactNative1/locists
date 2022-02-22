import { View, Text, Image, Button, TextInput, Alert } from 'react-native';
import useMedia from '../hooks/useMedia';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

import useAuthStorage from '../hooks/useAuthStorage';
import { useFocusEffect } from '@react-navigation/native';
import useTag from '../hooks/useTag';
import useDevice from '../hooks/useDevice';
import UploadAvatar from './UploadAvatar';

const UploadMedia = ( { mediaType } ) => {
  const { user, token } = useAuthStorage();
  const { postTag } = useTag()
  const { uploadMedia, loadingMediaUpload } = useMedia();

  /* useFocusEffect(
      useCallback( () => {
        return () => reset();
      }, [] ),
  ); */



  const onSubmit = async ( data, mediaDescription, imageSelected, image ) => {
    console.log( 'desc onSubmit', mediaDescription );
    // console.log( 'uploadMedia onSubmit' );

    /* const mediaDescription = {
      mediaType,
      owner: user.user_id,
      description: data.description,
    }; */

    mediaDescription = JSON.stringify( mediaDescription );
    if ( !imageSelected ) {
      Alert.alert( 'Please, select a file' );
      return;
    }
    // TODO: Handle too big image case

    // eslint-disable-next-line
    const formData = new FormData();
    // formData.append( 'title', data.title );
    formData.append( 'description', mediaDescription );
    const filename = image.split( '/' ).pop();
    let fileExtension = filename.split( '.' ).pop();
    fileExtension = fileExtension === 'jpg' ? 'jpeg' : fileExtension;
    formData.append( 'file', {
      uri: image,
      name: filename,
      type: mediaDescription.fileType + '/' + fileExtension,
    } );

    // console.log('token in submitMedia ', token)
    // Upload media
    const response = await uploadMedia( formData, token );
    // Create new tag and associate it with uploaded media
    const tagResponse = await postTag(
        {
          file_id: response.file_id,
          tag: `avatar_${user.user_id}`,
        },
        token
    );
    console.log('new tag res in onSubmit', tagResponse)
    console.log('upload res in onSubmit', response)

  };



  switch ( mediaType ) {
    case 'avatar':
      return <UploadAvatar onSubmit={onSubmit} />

    case 'post':
      return (
          <View>

          </View>
      );
    default:
      return (
          <View>

          </View>
      );
  }
};

export default UploadMedia;