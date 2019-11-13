---
id: introduction
title: Introduction
sidebar_label: Introduction
---

Navigation Components is a component-driven navigation library for React Native. It aims to take what's really nice about developing with React Native and make it even better by abstracting away some of the annoying stuff. The end result is a tool that stays out of your way and lets you work with your own components and app code.

## Features

- component-driven API
- first class support for routing
- gesture support out of the box
- native navigation options
- relative routing
- deep linking
- dedicated test utilities

## What are some of the issues this library is trying to solve?

### Static Configurations

Libraries like React Router and Reach Router derive active components from the current window location. Likewise, this library listens and responds to a location and updates the focus of your app in a similar fashion. This has tons of benefits, including staying true to the dynamic nature of React.

### Nesting and Coupling

Say you need to add a feature that is deeply nested in your app. Development is a frustrating experience by virtue of the fact that it's just hard to get to the screens you want to work on. So you pull out the subnavigator you're working on and render it in isolation. Now you realize it needs to be wrapped by a couple other parent navigators or depends on a provider at the root of your application. You also want to test it but need to mock out the world to get it to render.

Routing helps solve this problem because every screen in your application can be accessed by a path, and you can pass a path to your root component while developing. This means deeply nested screens are a breeze to get to, and you don't need to pull out and reintegrate components while developing so you'll have confidence that the feature will work in the app as it is!

Routing with relative paths means that your (relative) links will work in isolation, so you can reuse your subnavigators and writing integration / unit tests is much easier (especially with the test utilities that come with the library!)

One added benefit of routing is that deep linking is included (almost) by default. You just need to configure the native code and pass your app scheme to the root component.

### Opinionated Components

This library provides little to no opinions on what you render - you can use whatever component library you'd like, or roll your own. The aim of this project is to give you a way to manage and configure the focus, gestures, transitions, and connections between screens in your app, but let you fully control of what and where you render your components.

If this all sounds good to you - continue on and get started!
