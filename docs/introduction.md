---
id: introduction
title: Introduction
sidebar_label: Introduction
---

React Navigation Library is a component-driven navigation library for React Native. It aims to take what's really nice about developing with React Native and make it even better by abstracting away some of the annoying stuff related to navigating between screens. The end result is a tool that stays out of your way and lets you work with your own components and app code.

## Features

- component-driven API
- first class support for routing
- gesture support out of the box
- native navigation options (react-native-screens/stack)
- relative routing
- deep linking
- dedicated test utilities

**What are some of the issues this library is trying to solve?**

## Static Configurations

When something is statically configured, it no longer lives entirely in the React world. This can make it frustrating to work with at times. The magic behind the scenes often becomes more trouble than it's worth when you need to debug an issue or understand why things are working unexpectedly, and you often end up with some messy overrides to get the results you want.

One solution to this is to provide an entirely component-driven API that dynamically renders screens. Libraries like React Router and Reach Router do this by deriving active components from the current window location. Likewise, this library listens and responds to a location and updates the focus of your app in a similar fashion. This has tons of benefits, including staying true to the dynamic nature of React.

## Coupling

Navigators quickly become coupled to the architecture of your app. Say you need to a feature that is deeply nested in your app. Developing this new feature is frustrating by virtue of the fact that it's just hard to get to. So you pull out the subnavigator you're working on and render it in isolation. Now you realize it needs to be wrapped by a couple other parent navigators or depends on a provider at the root of your application. You want to test it but need to mock out the world to get it to render.

Routing helps solve this problem because every screen in your application can be accessed by a path, and you can pass a path to your root component while developing. This means deeply nested screens are a breeze to get to, and you don't need to pull out and reintegrate components while developing so you'll have confidence that the feature will work in the app as it is!

Than being said, it's often important to be able to pull out a section of your app, for example to test it or reuse it in multiple parts of your app.

Routing with relative paths means that your (relative) links will work in isolation, so you can reuse your subnavigators and writing integration / unit tests is much easier (especially with the test utilities that come with the library!)

One added benefit of routing is that deep linking is included (almost) by default. You just need to configure the native code and pass your app scheme to the root component.

## Opinionated Components

Component libraries that provide opinionated styles are really awesome to get up and running quickly, but chances are that over time your application will need its own set of components with its own look and feel. Most libraries provide extensibility to the components they give you, but at the end of the day they aren't your components, and take time and effort to work with.

This library provides little to no opinions in this arena - in fact you can use whatever component library you'd like, or roll your own. The aim of this project is to give you a way to manage and configure the focus, gestures, transitions, and connections between screens in your app, but let you fully control of what and where you render your components.

If this all sounds good to you - please continue on and get started!
