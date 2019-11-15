import React from 'react';
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  TextInputProps,
  StyleSheet,
  Button,
} from 'react-native';

import {Formik, useFormikContext} from 'formik';

import {
  Navigator,
  Tabs,
  Modal,
  useModal,
  History,
  Link,
  useNavigate,
} from 'navigation-components';

interface iFormValues {
  type: 'signup' | 'login' | '';
  name: string;
  email: string;
  password: string;
}

const initialFormValues: iFormValues = {
  type: '',
  name: '',
  email: '',
  password: '',
};

function LoginForms() {
  const navigate = useNavigate();

  function handleSubmit(data: iFormValues) {
    navigate('success-modal');
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <History>
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          <Navigator routes={['/', 'success-modal']}>
            <Modal>
              <Forms />
              <SuccessModal />
            </Modal>
          </Navigator>
        </Formik>
      </History>
    </SafeAreaView>
  );
}

function Forms() {
  return (
    <Navigator initialIndex={1} routes={['signup', 'login']}>
      <Tabs>
        <Signup />
        <Login />
      </Tabs>
    </Navigator>
  );
}

function Signup() {
  const formik = useFormikContext<iFormValues>();

  function handleSubmit() {
    formik.setFieldValue('type', 'signup');
    formik.handleSubmit();
  }

  return (
    <>
      <Header title="Signup" />

      <View style={styles.form}>
        <Input name="name" placeholder="Enter name" />
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...passwordInputProps}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />
      <Link to="login">
        <Text style={styles.link}>Go to login</Text>
      </Link>
    </>
  );
}

function Login() {
  const formik = useFormikContext<iFormValues>();

  function handleSubmit() {
    formik.setFieldValue('type', 'login');
    formik.handleSubmit();
  }

  return (
    <>
      <Header title="Login" />
      <View style={styles.form}>
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...passwordInputProps}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />

      <Link to="signup">
        <Text style={styles.link}>Go to signup</Text>
      </Link>
    </>
  );
}

function SuccessModal() {
  const modal = useModal();
  const email = useFormikContext().getFieldProps('email').value;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'coral',
        borderRadius: 10,
      }}>
      <Header title="Success" />
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
        }}>
        Welcome {email}!
      </Text>
      <Button title="Dismiss" onPress={() => modal.hide()} />
    </View>
  );
}

function Header({title}) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

interface iInput extends TextInputProps {
  name: string;
}

function Input(props: iInput) {
  const formik = useFormikContext();
  const {value} = formik.getFieldProps(props.name);

  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={formik.handleChange(props.name)}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 50,
  },

  header: {
    height: 80,
    justifyContent: 'center',
  },

  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '600',
  },

  input: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 18,
    marginVertical: 15,
  },

  link: {
    fontSize: 18,
    color: 'aquamarine',
    textAlign: 'center',
    lineHeight: 24,
  },
});

const emailInputProps: Partial<TextInputProps> = {
  autoCompleteType: 'email',
  keyboardType: 'email-address',
  textContentType: 'emailAddress',
  autoCapitalize: 'none',
};

const passwordInputProps: Partial<TextInputProps> = {
  textContentType: 'password',
  autoCapitalize: 'none',
  secureTextEntry: true,
};

function Inner() {
  return (
    <Navigator routes={['one', 'two']}>
      <Tabs>
        <Text>One</Text>

        <View>
          <Text>Two</Text>
          <Link to="../../root">
            <Text>Back</Text>
          </Link>
        </View>
      </Tabs>
    </Navigator>
  );
}

function Outer({children}: any) {
  return (
    <History>
      <Navigator routes={['root', 'inner']}>
        <Tabs>
          <View>
            <Text>root</Text>
            <Link to="inner/two">
              <Text>Link</Text>
            </Link>
          </View>
          {children}
        </Tabs>
      </Navigator>
    </History>
  );
}

function Tester() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Outer>
        <Inner />
      </Outer>
    </SafeAreaView>
  );
}

import {enableScreens} from 'react-native-screens';

enableScreens();

import {SpotifyApp} from './src/spotify';

function Container() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <History>
        <Navigator routes={['library', '/']}>
          <Tabs>
            <SpotifyApp />
            <Text>Hi</Text>
          </Tabs>
        </Navigator>
      </History>
    </SafeAreaView>
  );
}

export default Container;
