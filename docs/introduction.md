---
id: introduction
title: Introduction
sidebar_label: Introduction
---

`navigation-components` is a component-driven navigation library for React Native. It aims to abstract away some of the difficult aspects of navigation and let you focus on your own components and app code.

## Features

- component-driven API
- routing
- gesture handling and transitions
- native navigation options
- deep linking
- dedicated test utilities

## What are some of the issues this library is trying to solve?

### Static Configurations

Libraries like React Router and Reach Router derive active components from the current window location. Likewise, this library listens and responds to a location and updates the focus of your app in a similar fashion. This has tons of benefits, including staying true to the dynamic nature of React.

### Nesting and Coupling

As an app grows it size, developing new features can be a frustrating experience, especially if those screens are nested in your app. Routing helps solve this problem because every screen in your application can be accessed by a path, and you can pass a path to your root component while developing. This means deeply nested screens are a breeze to get to, and you don't need to pull out and reintegrate components while developing so you'll have confidence that the feature will work in the app as it is!

The relative routing utilities provided make it a lot simpler to develop different parts of your navigation as their own functional units, increasing their reusability and testability.

Deep linking is included (almost) by default. You just need to configure the native code and pass your app scheme to the root component.

### Opinionated Components

This library provides little to no opinions on what you render - you can use whatever component library you'd like, or roll your own. The aim of this project is to give you a way to manage and configure the focus, gestures, transitions, and connections between screens in your app, but let you fully control of what and where you render your components.

If this all sounds good to you - continue on and get started!
