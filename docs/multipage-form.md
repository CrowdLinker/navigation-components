---
id: multipage-form
title: Building a multipage form
sidebar_label: Building a multipage form
---

In this section we'll be implementing a multipage login form. Let's define the success criteria before we start. Our form should have:

- a way to signup with a name, email, and password
- a way to login with an email and password
- a success screen to indicate signup/login is complete

After we're done, we'll fully test out the functionality of our form and refactor it to improve some of the implemntation detail.

Our first task will be to create the our forms - these will be dead simple as they aren't what we're focused on:

```javascript
import React from 'react';
import { View, Text, TextInput, Button, SafeAreaView } from 'react-native';

function AppContainer({ children }) {
  return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
}

function App() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSignup(name: string) {
    console.warn('signup()');
  }

  function handleLogin() {
    console.warn('login()');
  }

  return (
    <AppContainer>
      <Signup
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSignup}
      />

      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    </AppContainer>
  );
}

function Signup({ email, setEmail, password, setPassword, onSubmit }) {
  const [name, setName] = React.useState('');

  return (
    <View>
      <Text>Signup Form</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Enter name" />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
      />

      <Button title="Submit" onPress={() => onSubmit(name)} />
    </View>
  );
}

function Login({ email, setEmail, password, setPassword, onSubmit }) {
  return (
    <View>
      <Text>Login Form</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
      />

      <Button title="Submit" onPress={() => onSubmit()} />
    </View>
  );
}

export default App;
```

Chances are, we'll want these two forms on separate screens, so let's wrap our views in a Navigator and display them on separate tabs:

```javascript
import { Navigator, Tabs } from 'react-navigation-library';

function App() {
  // ...

  return (
    <Navigator>
      <Tabs>
        <Signup
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
      </Tabs>
    </Navigator>
  );
}
```

Now we can swipe between our forms. If we want to default to the Login form as our first screen, we can do so by updating the `initialIndex` of our Navigator:

```javascript
function App() {
  // ...

  return (
    <AppContainer>
      <Navigator initialIndex={1}>...</Navigator>
    </AppContainer>
  );
}
```

Great, our login form is now our initial screen. There's still a problem - it's not immediately clear to the user that they can swipe between the screens. Let's add some buttons to let them navigate between the forms:

```javascript
import { useTabs } from 'react-navigation-library';

function Signup({ email, setEmail, password, setPassword }) {
  const [name, setName] = React.useState('');

  const tabs = useTabs();

  return (
    <View>
      ...
      <Button title="Go to login" onPress={() => tabs.goTo(1)} />
    </View>
  );
}

function Login({ email, setEmail, password, setPassword }) {
  const tabs = useTabs();

  return (
    <View>
      ...
      <Button title="Go to signup" onPress={() => tabs.goTo(0)} />
    </View>
  );
}
```

Awesome - we can now navigate between screens with `useTabs().goTo(index: number)`. Our last screen will be a success modal that pops up after signup or login. In a real world example, you'd likely want to redirect the user to the app's home page or onboarding with a link of some king.

First, let's add a modal that will pop up with a success message. We'll wrap our forms in a Modal container, and then we can toggle a modal from within our form components

```javascript
import { Modal, useModal } from 'react-navigation-library';

function SuccessModal({ email }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text>Success - Welcome {email}!</Text>
      <Button title="Go to app" onPress={() => {}} />
    </View>
  );
}

function App() {
  // ...

  return (
    <AppContainer>
      <Navigator>
        <Modal>
          <Forms
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />

          <SuccessModal email={email} />
        </Modal>
      </Navigator>
    </AppContainer>
  );
}

// extract forms into their own component - now we can toggle our modal from inside the forms

function Forms({ email, setEmail, password, setPassword }) {
  const modal = useModal();

  function handleSignup(name: string) {
    modal.show();
  }

  function handleLogin() {
    modal.show();
  }

  return (
    <Navigator>
      <Tabs>
        <Signup
          email={email}
          setEmail={email}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSignup}
        />

        <Login
          email={email}
          setEmail={email}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />
      </Tabs>
    </Navigator>
  );
}
```
