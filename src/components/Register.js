import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup';

import theme from '../theme';
import useUser from '../hooks/useUser';
import { yupResolver } from '@hookform/resolvers/yup';

const RegisterSchema = Yup.object().shape( {
  username: Yup.string().
      min( 5, 'Too Short!' ).
      max( 10, 'Too Long!' ).
      required( 'Username is required' ),
  password: Yup.string().
      required( 'Required' ),
  passwordConfirm: Yup.string().
      min( 5, 'Too short' ).
      max( 16, 'Too long' ).
      required( 'Password confirmation is required' ).
      oneOf( [ Yup.ref( 'password' ), null ], 'Passwords must match' ),
  email: Yup.string().email( 'Invalid email' ).required( 'Required' ),
  fullName: Yup.string().
      required( 'Required' ),
} );

const Register = props => {
  const { register, loading, error } = useUser();

  const { control, handleSubmit, formState: { errors }, reset } = useForm( {
    defaultValues: {
      username: '',
      password: '',
      email: '',
      fullName: '',
    },
    resolver: yupResolver( RegisterSchema ),
    mode: 'onBlur',
  } );

  // Submit registration form with given data
  const onSubmit = async ( data ) => {
    console.log( 'Registration onSubmit called' );

    // Register user
    console.log( '1 loading:', await loading );
    const registeredUser = await register( data.username, data.password,
        data.email,
        data.fullName );

    console.log( '2 loading:', loading );
    console.log( 'registeredUser: ', registeredUser );
    console.log( 'error: ', error );

  };

  return (
      <KeyboardAvoidingView>
        <View>
          <Text>
            Register
          </Text>

          <View style={ theme.inputContainer }>
            <Controller
                control={ control }
                render={ ( { field: { onChange, onBlur, value } } ) => (
                    <TextInput
                        style={ theme.input }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="Username"
                    />
                ) }
                name="username"
            />
            { errors.username && <Text>{ errors.username.message }</Text> }
          </View>

          <View style={ theme.inputContainer }>
            <Controller
                control={ control }
                render={ ( { field: { onChange, onBlur, value } } ) => (
                    <TextInput
                        style={ theme.input }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="email"
                    />
                ) }
                name="email"
            />
            { errors.email && <Text>{ errors.email.message }</Text> }
          </View>

          <View style={ theme.inputContainer }>
            <Controller
                control={ control }
                render={ ( { field: { onChange, onBlur, value } } ) => (
                    <TextInput
                        style={ theme.input }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="Password"
                    />
                ) }
                name="password"
            />
            { errors.password && <Text>{ errors.password.message }</Text> }
          </View>

          <View style={ theme.inputContainer }>
            <Controller
                control={ control }
                render={ ( { field: { onChange, onBlur, value } } ) => (
                    <TextInput
                        style={ theme.input }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="Password confirmation"
                    />
                ) }
                name="passwordConfirm"
            />
            { errors.passwordConfirm &&
            <Text>{ errors.passwordConfirm.message }</Text> }
          </View>

          <View style={ theme.inputContainer }>
            <Controller
                control={ control }
                render={ ( { field: { onChange, onBlur, value } } ) => (
                    <TextInput
                        style={ theme.input }
                        onBlur={ onBlur }
                        onChangeText={ onChange }
                        value={ value }
                        placeholder="Full name"
                    />
                ) }
                name="fullName"
            />
            { errors.fullName && <Text>{ errors.fullName.message }</Text> }
          </View>


          <Button title="Register" onPress={ handleSubmit( onSubmit ) }/>
          {/*console.log(errors)*/ }

        </View>
      </KeyboardAvoidingView>
  );
};

export default Register;
