---
id: multipage-form
title: Building a multipage form
sidebar_label: Building a multipage form
---

In this section we'll be implementing a multipage login form. Let's define the success criteria before we start. Our form should have:

- a way to signup and login
- a success screen to indicate signup/login is complete
- forms should be on separate pages that we can easily navigate between

Our first task will be to create the our forms - these will be dead simple as they aren't what we're focused on. We'll pull in `formik` to help simplify our form logic so we can focus on the navigation portions of our forms.

```bash
yarn add formik
```

If you're not familiar with Formik, know that in this case it is only abstracting away some of the boilerplate that you would have to write if you were to implement the form yourself.

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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Forms />
    </SafeAreaView>
  );
}

function Forms() {
  function handleSubmit(data: iFormValues) {}

  return (
    <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
      <>
        <Signup />
        <Login />
      </>
    </Formik>
  );
}

function Signup() {
  return (
    <>
      <Header title="Signup" />

      <View style={{ padding: 50 }}>
        <Input name="name" placeholder="Enter name" />
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...emailInputProps}
        />
      </View>
    </>
  );
}

function Login() {
  return (
    <>
      <Header title="Login" />
      <View style={{ padding: 50 }}>
        <Input name="email" placeholder="Enter email" {...emailInputProps} />
        <Input
          name="password"
          placeholder="Enter password"
          {...passwordInputProps}
        />
      </View>
    </>
  );
}

function Header({ title }) {
  return (
    <View style={{ height: 80, justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, textAlign: 'center', fontWeight: '600' }}>
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
  const { value } = formik.getFieldProps(props.name);

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

export { LoginForms };
```

We can test out if our forms are working by updating the email field and noting both forms update in sync. Let's move these to separate screens by wrapping the forms in a navigator:

```tsx
import { Navigator, Tabs } from 'react-navigation-library';

function Forms() {
  function handleSubmit(data: iFormValues) {}

  return (
    <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
      <Navigator>
        <Tabs>
          <Signup />
          <Login />
        </Tabs>
      </Navigator>
    </Formik>
  );
}
```

Now we can swipe between our forms. If we want to default to the Login form as our first screen, we can do so by updating the `initialIndex` of our Navigator:

```tsx
function Forms() {
  function handleSubmit(data: iFormValues) {}

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        <Navigator initialIndex={1}>
          <Tabs>
            <Signup />
            <Login />
          </Tabs>
        </Navigator>
      </Formik>
    </SafeAreaView>
  );
}
```

Refresh and you'll see that the login form is now the initial screen. There's still a problem - it's not immediately clear to the user that they can swipe between the screens. Let's add some buttons to let them navigate between the forms:

```tsx
import { Button } from 'react-native';
import { useTabs } from 'react-navigation-library';

function Signup() {
  const tabs = useTabs();

  return (
    <>
      ...
      <Button title="Go to login" onPress={() => tabs.goTo(1)} />
    </>
  );
}

function Login() {
  const tabs = useTabs();

  return (
    <>
      ...
      <Button title="Go to signup" onPress={() => tabs.goTo(0)} />
    </>
  );
}
```

Awesome - we can now navigate between screens with `useTabs().goTo(index: number)`.

The last screen we'll add will be a success modal that pops up after signup or login. In a real world example, you'd likely want to redirect the user to the app's home page or onboarding with a link of some kind.

First, let's add create the modal component. Then we'll wrap our forms in a Modal container so that we can toggle a modal from within our form components

```tsx
import { Modal, useModal } from 'react-navigation-library';

// implement our success modal screen:
function SuccessModal() {
  const modal = useModal();

  return (
    <View
      style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}
    >
      <Header title="Success" />
      <Text style={{ fontSize: 20, textAlign: 'center' }}>Welcome!</Text>
      <Button title="Dismiss" onPress={() => modal.hide()} />
    </View>
  );
}

// update login forms to toggle the modal when submitting is a success:
function Forms() {
  const modal = useModal();

  function handleSubmit(data: iFormValues) {
    modal.show();
  }

  // ...
}

// add submit buttons to our forms
function Signup() {
  const tabs = useTabs();
  const formik = useFormikContext<iFormValues>();

  function handleSubmit() {
    formik.setFieldValue('type', 'signup');
    formik.handleSubmit();
  }

  return (
    <>
      ...
      <Button title="Submit" onPress={handleSubmit} />
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
      ...
      <Button title="Submit" onPress={handleSubmit} />
    </>
  );
}

// wrap the forms in the modal we've just created
function LoginForms() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator>
        <Modal>
          <Forms />
          <SuccessModal />
        </Modal>
      </Navigator>
    </SafeAreaView>
  );
}
```
