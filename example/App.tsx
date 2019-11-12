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
  useTabs,
  Modal,
  useModal,
} from 'react-navigation-library';

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
  const [status, setStatus] = React.useState('');

  function handleSubmit(data: iFormValues) {
    setStatus('success');
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        <Navigator>
          <Modal active={status === 'success'} onClose={() => setStatus('')}>
            <Forms />
            <SuccessModal />
          </Modal>
        </Navigator>
      </Formik>
    </SafeAreaView>
  );
}

function Forms() {
  return (
    <Navigator initialIndex={1}>
      <Tabs>
        <Signup />
        <Login />
      </Tabs>
    </Navigator>
  );
}

function Signup() {
  const tabs = useTabs();

  const formik = useFormikContext<iFormValues>();

  function handleSubmit() {
    formik.setFieldValue('type', 'signup');
    formik.handleSubmit();
  }

  return (
    <>
      <Header title="Signup" />

      <View style={{padding: 50}}>
        <Input name="name" placeholder="Enter name" />
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...passwordInputProps}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Go to login" onPress={() => tabs.goTo(1)} />
    </>
  );
}

function Login() {
  const tabs = useTabs();

  const formik = useFormikContext<iFormValues>();

  function handleSubmit() {
    formik.setFieldValue('type', 'login');
    formik.handleSubmit();
  }

  return (
    <>
      <Header title="Login" />
      <View style={{padding: 50}}>
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...passwordInputProps}
        />
      </View>

      <Button title="Submit" onPress={handleSubmit} />
      <Button title="Go to signup" onPress={() => tabs.goTo(0)} />
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
    <View style={{height: 80, justifyContent: 'center'}}>
      <Text style={{fontSize: 26, textAlign: 'center', fontWeight: '600'}}>
        {title}
      </Text>
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
      style={{
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        fontSize: 18,
        marginVertical: 15,
      }}
      value={value}
      onChangeText={formik.handleChange(props.name)}
      {...props}
    />
  );
}

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

export default LoginForms;
