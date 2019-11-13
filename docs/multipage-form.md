---
id: multipage-form
title: Building a multipage form
sidebar_label: Building a multipage form
---

In this section we will implement a login / signup form. Let's define the success criteria before we start. Our form should have:

- a way to signup and login
- a success screen to indicate signup/login is complete
- the forms should be on separate pages that we can easily navigate between

Our first task will be to create the our forms - these will be dead simple as they aren't what we're focused on. We'll pull in `formik` to help simplify our form logic so we can focus on the navigation.

```bash
yarn add formik
```

If you're not familiar with Formik, know that in this case it is only abstracting away some of the boilerplate that you would have to write if you were to implement the form yourself.

## Setup

Here is the boilerplate to get our forms up and running:

```tsx
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

import { Formik, useFormikContext } from 'formik';

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
  function handleSubmit(data: iFormValues) {}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        <Forms />
      </Formik>
    </SafeAreaView>
  );
}

function Forms() {
  return (
    <>
      <Signup />
      <Login />
    </>
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
    </>
  );
}

function Header({ title }) {
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
  const { value } = formik.getFieldProps(props.name);

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

export default LoginForms;
```

Make sure the forms are working by updating the email field.

## Separating the forms

Let's move the forms to separate screens with a tabs component:

```tsx
import { Navigator, Tabs } from 'navigation-components';

function Forms() {
  return (
    <Navigator>
      <Tabs>
        <Signup />
        <Login />
      </Tabs>
    </Navigator>
  );
}
```

Now we can swipe between our forms. If we want to default to the Login form as our first screen, we can do so by updating the `initialIndex` of our Navigator:

```tsx
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
```

Refresh and you'll see that the login form is now the initial screen. Note that you could also just switch the order of the forms, and Login would be the first to appear. But then the Signup form would appear to the right of the Login form. This means that the **order** of screens determines how they transition in and out.

## Navigating with a button

There's still a problem - it's not immediately clear to the user that they can swipe between the screens. Let's add some buttons to let them navigate via a button press. In order to do so, we'll add some routes to the navigator:

```tsx
import { Link, History } from 'navigation-components';

function LoginForms() {
  return (
    <History>
      {...}
    </History>
  )
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
  return (
    <>
      ...
      <Link to="login">
        <Text style={styles.link}>Go to login</Text>
      </Link>
    </>
  );
}

function Login() {
  return (
    <>
      ...
      <Link to="signup">
        <Text style={styles.link}>Go to signup</Text>
      </Link>
    </>
  );
}
```

Awesome - we can now navigate between screens with our routing in place.

## Adding a success modal

The last screen we'll add will be a success modal that pops up after signup or login. In a real world example, you'd likely want to redirect the user to the app's home page or onboarding with a link of some kind.

```tsx
import { Modal, useNavigate, useModal } from 'navigation-components';

// implement our success modal screen
function SuccessModal() {
  // we can imperatively toggle our modal using the useModal() hook:
  const modal = useModal();

  const email = useFormikContext().getFieldProps('email').value;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'coral',
        borderRadius: 10,
      }}
    >
      <Header title="Success" />
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        Welcome {email}!
      </Text>
      <Button title="Dismiss" onPress={() => modal.hide()} />
    </View>
  );
}

// wrap the forms in the modal we've just created and add our routes
function LoginForms() {
  const navigate = useNavigate();

  function handleSubmit(data: iFormValues) {
    // this will navigate similar to how a link would:
    navigate('success-modal');
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        <Navigator routes={['/', 'success-modal']}>
          <Modal active={status === 'success'} onClose={() => setStatus('')}>
            <Forms />
            <SuccessModal />
          </Modal>
        </Navigator>
      </Formik>
    </SafeAreaView>
  );
}
```

Try entering an email and hitting the submit button to see the success modal pop up.

That's it! While it's really basic right now, the core functionality related to navigating is setup with relatively little configuration, and extending the form will be really simple. If we wanted a Reset password workflow for example, we just need to add it as another tab.

Here is the code we just wrote in it's entirety:

```tsx
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

import { Formik, useFormikContext } from 'formik';

import {
  Navigator,
  Tabs,
  Modal,
  useModal,
  useNavigate,
  History,
  Link,
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
    <SafeAreaView style={{ flex: 1 }}>
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
      }}
    >
      <Header title="Success" />
      <Text
        style={{
          fontSize: 20,
          textAlign: 'center',
        }}
      >
        Welcome {email}!
      </Text>
      <Button title="Dismiss" onPress={() => modal.hide()} />
    </View>
  );
}

function Header({ title }) {
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
  const { value } = formik.getFieldProps(props.name);

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

export default LoginForms;
```

## Summary

- We used `formik` to handle some of the boilerplate logic related to forms. While not necessary, it helped reduce repetitive code and prop drilling that we would encounter if we had implemented the forms from scratch.

- Forms (or any view) can be separated into different screens with the Tabs component, which lets the user swipe between them.

- A Navigator can be configured to render the Login screen first by passing an `initialIndex` prop. Screens transition in and out based on the **order** in which they are declared. In our case, the Signup form is on the left and the Login form is on the right because of the order in which we render them.

- Routing lets users navigate to different screens via a Link or useNavigate().navigate() function call

## Next steps

Our form is looking pretty good - in the next section we'll look into testing it fully.
