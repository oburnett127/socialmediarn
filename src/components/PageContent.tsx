import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

interface PageContentProps {
  title: string;
  children: ReactNode;
}

function PageContent({ title, children }: PageContentProps) {
  return (
    <View>
      <Text>{title}</Text>
      {children}
    </View>
  );
}

export default PageContent;

