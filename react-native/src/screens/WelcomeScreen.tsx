import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
// import {useDispatch} from 'react-redux';
import {AppStyles} from './AppStyles';
import {useKeycloak as useKeycloakNative} from '@react-keycloak/native';
import Label from 'react-native-ui-lib/src/incubator/TextField/Label';
import {Button} from 'react-native-ui-lib';
import {bool} from 'prop-types';

// @ts-ignore
function WelcomeScreen({navigation}): JSX.Element {
  const {keycloak} = useKeycloakNative() as {keycloak: any};
  const hasRole = keycloak.hasRealmRole('hastwitter');
  return (
    <View style={styles.container}>
      {!keycloak.authenticated && (
        <>
          <Text style={styles.title}>
            Welcome! Please log in or sign up to continue.
          </Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => keycloak.login()}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
      {/* @ts-ignore */}
      {!!keycloak.authenticated && !hasRole && (
        <>
          <Text style={styles.title}>
            Hello {keycloak.tokenParsed.given_name}!
          </Text>
          <Label
            label={
              'Sorry, You do not have access to this app. Please login with Twitter to continue.'
            }
          />
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => keycloak.logout()}>
            <Text style={styles.loginText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
      {/* @ts-ignore */}
      {!!keycloak.authenticated && hasRole && (
        <>
          <Text style={styles.title}>
            Hello {keycloak.tokenParsed.given_name}{' '}
            {keycloak.tokenParsed.family_name}!
          </Text>
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => navigation.navigate('Tweet')}>
            <Text style={styles.loginText}>Start Tweeting!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupContainer}
            onPress={() => keycloak.logout()}>
            <Text style={styles.signupText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
// PostTweet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  loginContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30,
  },
  loginText: {
    color: AppStyles.color.white,
  },
  signupContainer: {
    alignItems: 'center',
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.white,
    borderRadius: AppStyles.borderRadius.main,
    padding: 8,
    borderWidth: 1,
    borderColor: AppStyles.color.tint,
    marginTop: 15,
  },
  signupText: {
    color: AppStyles.color.tint,
  },
  spinner: {
    marginTop: 200,
  },
});

export default WelcomeScreen;
