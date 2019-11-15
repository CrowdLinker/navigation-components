import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { useNavigate } from './hooks';

interface iLink extends TouchableOpacityProps {
  to: string;
  children: React.ReactNode;
}

function Link({ to, children, ...rest }: iLink) {
  const navigate = useNavigate();

  function handlePress() {
    navigate(to);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint={`Go to ${to}`}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

export { Link };
