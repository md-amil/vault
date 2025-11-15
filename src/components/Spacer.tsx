// Spacer.tsx
import React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  height?: number;
  width?: number;
};

export default function Spacer({ height = 16, width = 0 }: SpacerProps) {
  return <View style={{ height, width }} />;
}
