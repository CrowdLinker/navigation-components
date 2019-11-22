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
  Tabbar,
  Tab,
  useInterpolation,
  Extrapolate,
} from 'navigation-components';

import Animated from 'react-native-reanimated';

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

import {useScreens, Screen, ScreenContainer} from 'react-native-screens';

useScreens();

function ScreenTest() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <View style={{flex: 1}}>
      <ScreenContainer style={{height: 300, width: 300}}>
        <Screen
          active={activeIndex >= 0 ? 1 : 0}
          style={{height: 200, width: 200, borderWidth: 1}}>
          <Text>Active 1</Text>
        </Screen>
        <Screen
          active={activeIndex >= 1 ? 1 : 0}
          style={{
            height: 200,
            width: 200,
            borderWidth: 1,
            transform: [{translateX: -100}],
          }}>
          <Text>Active 2</Text>
        </Screen>
        <Screen
          active={activeIndex >= 2 ? 1 : 0}
          style={{height: 200, width: 200, borderWidth: 1}}>
          <Text>Active 3</Text>
        </Screen>
      </ScreenContainer>
      <Text>activeIndex: {activeIndex}</Text>
      <Button title="Inc" onPress={() => setActiveIndex(activeIndex + 1)} />
      <Button title="Dec" onPress={() => setActiveIndex(activeIndex - 1)} />
    </View>
  );
}

import {SpotifyApp} from './src/spotify';

function Container() {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <History>
        <SpotifyApp />
      </History> */}

      <MyTabs />
    </SafeAreaView>
  );
}

function MyTabs() {
  return (
    <Navigator>
      <Tabs pageInterpolation={tabInterpolation}>
        <MyScreen index={0}>
          <Text style={{textAlign: 'center'}}>1</Text>
        </MyScreen>
        <MySpecialScreen index={1}>
          <Text style={{textAlign: 'center'}}>2</Text>
        </MySpecialScreen>
        <MyScreen index={2}>
          <Text style={{textAlign: 'center'}}>3</Text>
        </MyScreen>
      </Tabs>

      <MyTabbar />
    </Navigator>
  );
}

const colors = ['aquamarine', 'coral', 'rebeccapurple'];

function MyScreen({children, index}) {
  return (
    <View
      style={{
        ...screenStyle,
        backgroundColor: colors[index],
      }}>
      {children}
    </View>
  );
}

const screenStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  marginHorizontal: 10,
};

const tabInterpolation: iPageInterpolation = {
  transform: [
    {
      translateX: {
        inputRange: [-1, 0, 1],
        outputRange: [45, 0, -45],
      },
    },

    {
      scale: {
        inputRange: [-1, 0, 1],
        outputRange: [0.9, 1, 0.9],
      },
    },
  ],

  zIndex: {
    inputRange: [-1, 0, 1],
    outputRange: [-1, 2, -1],
  },
};

function MySpecialScreen({children, index}: any) {
  const styles = useInterpolation({
    transform: [
      {
        translateY: {
          inputRange: [-1, 0, 1],
          outputRange: [-100, 0, 100],
        },
      },
    ],
  });

  return (
    <Animated.View
      style={{...screenStyle, ...styles, backgroundColor: colors[index]}}>
      {children}
    </Animated.View>
  );
}

function MyTabbar() {
  return (
    <Tabbar>
      <MyCustomTab>
        <Text>1</Text>
      </MyCustomTab>
      <MyCustomTab>
        <Text>2</Text>
      </MyCustomTab>
      <MyCustomTab>
        <Text>3</Text>
      </MyCustomTab>
    </Tabbar>
  );
}

function MyCustomTab({children}: any) {
  const styles = useInterpolation({
    transform: [
      {
        scale: {
          inputRange: [-1, 0, 1],
          outputRange: [0.7, 1, 0.7],
          extrapolate: Extrapolate.CLAMP,
        },
      },
    ],

    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: Extrapolate.CLAMP,
    },
  });

  return (
    <Tab
      style={{
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        ...styles,
      }}>
      {children}
    </Tab>
  );
}

export default Container;
